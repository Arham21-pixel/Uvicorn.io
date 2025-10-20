import { NextResponse } from "next/server"
import axios from "axios"

// Razorpay API authentication header
function razorpayAuthHeader() {
  const id = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET
  
  if (!id || !secret) {
    throw new Error("Razorpay credentials not configured")
  }
  
  return 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64')
}

export async function POST(req: Request) {
  try {
    const { amount, name, email, phone, orderId } = await req.json()

    // Check if Razorpay is configured
    const id = process.env.RAZORPAY_KEY_ID
    const secret = process.env.RAZORPAY_KEY_SECRET
    
    if (!id || !secret || id === 'rzp_test_YOUR_KEY_ID' || secret === 'YOUR_KEY_SECRET') {
      console.log('⚠️ Razorpay not configured - skipping payment link generation')
      return NextResponse.json(
        { ok: false, error: "Payment gateway not configured. Please add Razorpay credentials." },
        { status: 200 } // Return 200 so checkout still succeeds
      )
    }

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Valid amount is required" },
        { status: 400 }
      )
    }

    // Razorpay expects amount in paise (INR). Example: ₹100 => 10000
    const payload = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      accept_partial: false,
      description: `Uvicorn Order ${orderId || 'N/A'}`,
      customer: {
        name: name || "Guest Customer",
        contact: phone || "",
        email: email || ""
      },
      notify: {
        sms: !!phone,
        email: !!email
      },
      reminder_enable: true,
      // Optional: callback URL after payment
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment-success`,
      callback_method: "get"
    }

    console.log('🔐 Creating Razorpay payment link for amount:', amount)

    const resp = await axios.post(
      'https://api.razorpay.com/v1/payment_links',
      payload,
      {
        headers: {
          Authorization: razorpayAuthHeader(),
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('✅ Payment link created:', resp.data.short_url)

    // resp.data contains short_url, id, etc.
    return NextResponse.json({
      ok: true,
      link: resp.data.short_url,
      paymentLinkId: resp.data.id,
      raw: resp.data
    })
  } catch (err: any) {
    console.error('❌ Payment link creation failed:', err.response?.data || err.message)
    
    return NextResponse.json(
      {
        ok: false,
        error: err.response?.data || err.message
      },
      { status: 500 }
    )
  }
}
