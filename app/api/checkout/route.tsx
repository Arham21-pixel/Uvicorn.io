import { NextResponse } from "next/server"
import type { CartJSON } from "@/lib/types"
import { formatINR } from "@/lib/currency"

const RAW_FROM = process.env.FROM_SENDER
const DEFAULT_FROM = "Uvicorn Orders <onboarding@resend.dev>"
const isValidFrom = (s?: string) => {
  if (!s) return false
  const simple = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const named = /^[^<>]+<\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*>$/
  return simple.test(s) || named.test(s)
}
const FROM_SENDER = isValidFrom(RAW_FROM) ? (RAW_FROM as string) : DEFAULT_FROM

const ALLOW_ALL_EMAILS = process.env.ALLOW_ALL_EMAILS === "true"
const parseEmail = (s?: string) => {
  if (!s) return undefined
  const m = s.match(/<\s*([^>]+)\s*>/)
  return (m?.[1] || s).trim()
}

const normalizeEmail = (s?: string) => {
  if (!s) return undefined
  const trimmed = s.trim()
  // supports "Name <email@domain.com>" and "email@domain.com"
  const m = trimmed.match(/<?([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)>?$/)
  return m ? m[1] : undefined
}

const senderEmail = parseEmail(FROM_SENDER)
const senderDomain = senderEmail?.split("@")[1]?.toLowerCase() || ""
const IS_RESEND_DEV_SENDER = senderDomain === "resend.dev"
const DEFAULT_OWNER = "uvicornshoppie@gmail.com"
const ADMIN_EMAIL = "uvicornshoppie@gmail.com"
const RAW_TEST_INBOX = process.env.RESEND_TEST_TO
const TEST_INBOX = (normalizeEmail(RAW_TEST_INBOX) || DEFAULT_OWNER).toLowerCase()
const OWNER_EMAIL = normalizeEmail(RAW_TEST_INBOX) || DEFAULT_OWNER

const isValidResendKey = (s?: string) => typeof s === "string" && s.trim().startsWith("re_")
const HAS_VALID_RESEND_KEY = isValidResendKey(process.env.RESEND_API_KEY)
const isInvalidResendKeyError = (err: unknown) => {
  try {
    const anyErr = err as any
    const msg = anyErr?.message?.toString()?.toLowerCase() || ""
    const status = anyErr?.statusCode ?? anyErr?.status
    const name = (anyErr?.name || "").toString().toLowerCase()
    return msg.includes("api key is invalid") || (status === 400 && name.includes("validation"))
  } catch {
    return false
  }
}
// end

export async function POST(req: Request) {
  try {
    const { email, cart, amounts } = (await req.json()) as {
      email: string
      cart: CartJSON
      amounts: { subtotal: number; tax: number; total: number }
    }

    if (!cart?.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`

    const recipientEmail = normalizeEmail(email)
    if (!recipientEmail) {
      return NextResponse.json({ error: "A valid recipient email is required" }, { status: 400 })
    }

    let hasValidKey = HAS_VALID_RESEND_KEY

    console.log("🔍 EMAIL DEBUG:", {
      recipientEmail,
      hasValidKey,
      IS_RESEND_DEV_SENDER,
      ALLOW_ALL_EMAILS,
      FROM_SENDER,
      DEFAULT_FROM
    })

    const isTestRecipient = recipientEmail.toLowerCase() === TEST_INBOX
    const fromToUse = DEFAULT_FROM // Always use default sender for buyer emails

    // Buyer emails: Send if we have a valid key (resend.dev allows any recipient)
    // For custom domains, also need ALLOW_ALL_EMAILS=true
    const canSendNow = hasValidKey && (IS_RESEND_DEV_SENDER || ALLOW_ALL_EMAILS)

    console.log("📧 Can send buyer email?", canSendNow)

    const recipients: string[] = [recipientEmail]
    const emailsRestricted = !canSendNow

    const html = `
      <h2>Order Confirmation - ${orderId}</h2>
      <p>Thank you for your purchase from <strong>Uvicorn</strong>.</p>
      ${recipientEmail ? `<p><em>Receipt recipient: ${recipientEmail}</em></p>` : ""}
      <table style="width:100%;border-collapse:collapse;margin-top:12px" border="1" cellpadding="8">
        <thead><tr><th align="left">Item</th><th align="right">Qty</th><th align="right">Price</th><th align="right">Line Total</th></tr></thead>
        <tbody>
          ${cart.items
            .map(
              (it) => `
            <tr>
              <td>${it.product.name}</td>
              <td align="right">${it.quantity}</td>
              <td align="right">${formatINR(it.product.price)}</td>
              <td align="right">${formatINR(it.product.price * it.quantity)}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
      <p style="margin-top:12px">
        Subtotal: <strong>${formatINR(amounts.subtotal)}</strong><br/>
        GST (18%): <strong>${formatINR(amounts.tax)}</strong><br/>
        Total: <strong>${formatINR(amounts.total)}</strong>
      </p>
    `

    let emailed = false
    let emailSimulated = false
    let note: string | undefined
    let ownerSimulated = false
    let ownerNote: string | undefined
    let emailedOwner = false

    if (!canSendNow) {
      emailSimulated = true
      note = !HAS_VALID_RESEND_KEY
        ? "Email simulated: RESEND_API_KEY missing or invalid. Make sure it starts with 're_' and is active."
        : "Email simulated in preview/unverified mode. Verify a domain and set FROM_SENDER + ALLOW_ALL_EMAILS=true to send to any recipient."
    } else {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY as string)
        console.log("📤 Sending buyer email to:", recipients)
        await resend.emails.send({
          from: fromToUse,
          to: recipients,
          replyTo: recipientEmail,
          subject: `Uvicorn Order ${orderId}`,
          html,
        })
        console.log("✅ Buyer email sent successfully!")
        emailed = true
      } catch (e) {
        const msg = (e as Error)?.message || "unknown"
        const keyHint = msg.toLowerCase().includes("api key is invalid")
          ? " The RESEND_API_KEY appears invalid. Replace it with a valid key."
          : ""
        note = `Recipient send failed: ${msg}.${keyHint}`
        emailSimulated = true
        if (isInvalidResendKeyError(e)) {
          hasValidKey = false
        }
      }
    }

    const ownerEmailNormalized = normalizeEmail(OWNER_EMAIL) || DEFAULT_OWNER
    const adminEmailNormalized = normalizeEmail(ADMIN_EMAIL)
    const fromForOwner = DEFAULT_FROM // Always use default sender for admin emails

    // Build list of admin recipients (owner + admin email)
    const adminRecipients: string[] = []
    if (adminEmailNormalized) adminRecipients.push(adminEmailNormalized) // Admin email first
    if (ownerEmailNormalized && ownerEmailNormalized !== adminEmailNormalized) {
      adminRecipients.push(ownerEmailNormalized) // Add owner if different
    }

    console.log("🔍 ADMIN EMAIL DEBUG:", {
      adminRecipients,
      hasValidKey,
      IS_RESEND_DEV_SENDER,
      ALLOW_ALL_EMAILS
    })

    // Admin emails: Send if we have a valid key (resend.dev allows any recipient)
    // For custom domains, also need ALLOW_ALL_EMAILS=true
    const canSendOwnerNowFinal =
      hasValidKey && adminRecipients.length > 0 && (IS_RESEND_DEV_SENDER || ALLOW_ALL_EMAILS)

    console.log("📧 Can send admin email?", canSendOwnerNowFinal)

    if (!canSendOwnerNowFinal) {
      ownerSimulated = true
      ownerNote = !hasValidKey
        ? "Admin copy simulated: RESEND_API_KEY missing or invalid."
        : adminRecipients.length === 0
          ? "Admin copy simulated: invalid admin email."
          : "Admin copy simulated: preview/unverified sender. Verify a domain and set FROM_SENDER + ALLOW_ALL_EMAILS=true."
    } else {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY as string)
        console.log("📤 Sending admin email to:", adminRecipients)
        await resend.emails.send({
          from: fromForOwner,
          to: adminRecipients,
          subject: `[ADMIN COPY] Uvicorn Order ${orderId}`,
          html: `
            <p style="background:#fff3cd;padding:12px;border-radius:4px;color:#856404;margin-bottom:16px">
              <strong>🔔 Admin Notification</strong><br/>
              This is an admin copy of the order receipt. Customer email: ${recipientEmail}
            </p>
            ${html}
          `,
        })
        console.log("✅ Admin email sent successfully!")
        emailedOwner = true
      } catch (e) {
        const msg = (e as Error)?.message || "unknown"
        const keyHint = msg.toLowerCase().includes("api key is invalid")
          ? " The RESEND_API_KEY appears invalid. Replace it with a valid key."
          : ""
        ownerNote = `Admin copy failed: ${msg}.${keyHint}`
        ownerSimulated = true
        if (isInvalidResendKeyError(e)) {
          hasValidKey = false
        }
      }
    }

    return NextResponse.json({
      orderId,
      emailed,
      emailSimulated,
      recipients,
      emailsRestricted,
      note,
      emailedOwner,
      ownerSimulated,
      ownerNote,
      ownerRecipient: ownerEmailNormalized,
    })
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
