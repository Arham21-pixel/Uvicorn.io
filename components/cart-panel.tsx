"use client"

import { Button } from "@/components/ui/button"
import { Button as StatefulButton } from "@/components/ui/stateful-button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { useOrders } from "@/hooks/use-orders"
import { formatINR } from "@/lib/currency"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function CartPanel({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { items, subtotal, tax, total, removeItem, updateQuantity, clear } = useCart()
  const { addOrder } = useOrders()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const onCheckout = async () => {
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." })
      throw new Error("Invalid email");
    }
    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        cart: {
          items: items.map((it) => ({
            product: it.product,
            quantity: it.quantity,
          })),
        },
        amounts: { subtotal, tax, total },
      }),
    })
    if (!res.ok) throw new Error("Checkout failed")
    const data = await res.json()
    console.log("📧 EMAIL DEBUG:", data) // Debug info
    
    const buyerMsg = data.emailed
      ? `✅ Buyer email sent to ${email}`
      : data.emailSimulated
        ? `⚠️ Buyer email simulated: ${data.note || "Check API key"}`
        : `❌ Buyer email failed: ${data.note || "Unknown error"}`
    
    const adminMsg = data.emailedOwner
      ? `✅ Admin email sent to uvicornshoppie@gmail.com`
      : data.ownerSimulated
        ? `⚠️ Admin email simulated: ${data.ownerNote || "Check API key"}`
        : `❌ Admin email failed: ${data.ownerNote || "Unknown error"}`
    
    // Save order to history
    addOrder({
      orderId: data.orderId,
      items: items.map(it => ({
        product: it.product,
        quantity: it.quantity
      })),
      email,
      subtotal,
      tax,
      total
    })
    
    // Check if payment link was generated
    if (data.paymentLink) {
      // Redirect to payment page with payment link and order details
      const paymentUrl = `/payment?link=${encodeURIComponent(data.paymentLink)}&orderId=${data.orderId}&amount=${total}`
      clear()
      onOpenChange(false)
      router.push(paymentUrl)
      return
    }
    
    toast({
      title: "Order placed",
      description: `Order #${data.orderId} confirmed.\n${buyerMsg}\n${adminMsg}`,
    })
    clear()
    onOpenChange(false)
  }

  return (
    <div
      id="cart-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      className={`fixed inset-0 z-50 ${open ? "overscroll-contain" : "pointer-events-none"}`}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => onOpenChange(false)}
      />
      {/* panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <Button variant="ghost" onClick={() => onOpenChange(false)} aria-label="Close cart">
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.product.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-pretty">{it.product.name}</p>
                    <p className="text-sm text-muted-foreground">{formatINR(it.product.price)} each</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label htmlFor={`qty-${it.product.id}`} className="sr-only">
                        Quantity
                      </label>
                      <Input
                        id={`qty-${it.product.id}`}
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => {
                          const v = Number.parseInt(e.target.value || "1", 10)
                          updateQuantity(it.product.id, Math.max(1, v))
                        }}
                        className="w-20"
                      />
                      <Button variant="secondary" onClick={() => removeItem(it.product.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-medium">{formatINR(it.product.price * it.quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* totals + email + actions */}
        <div className="border-t px-4 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatINR(subtotal)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">GST (18%)</span>
            <span className="font-medium">{formatINR(tax)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-semibold">{formatINR(total)}</span>
          </div>

          <div className="mt-4">
            <label htmlFor="checkout-email" className="mb-1 block text-sm font-medium">
              Email for receipt
            </label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              We’ll send the order confirmation directly to this address.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" onClick={clear}>
              Clear
            </Button>
            <StatefulButton onClick={onCheckout} disabled={items.length === 0 || !isValidEmail(email)}>
              Checkout
            </StatefulButton>
          </div>
        </div>
      </div>
    </div>
  )
}
