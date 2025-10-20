"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import QRCode from "qrcode"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const paymentLink = searchParams.get("link")
  const orderId = searchParams.get("orderId")
  const amount = searchParams.get("amount")

  useEffect(() => {
    if (paymentLink) {
      // Generate QR code from payment link
      QRCode.toDataURL(paymentLink, { width: 300, margin: 2 })
        .then(url => {
          setQrCodeUrl(url)
        })
        .catch(err => {
          console.error("QR code generation failed:", err)
        })
    }
  }, [paymentLink])

  if (!paymentLink) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>❌ No Payment Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No payment information found. Please try checking out again.
            </p>
            <Button onClick={() => router.push("/")}>
              Return to Shop
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-2xl mx-auto pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="text-5xl mb-2">💳</div>
              </motion.div>
              <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
              {orderId && (
                <p className="text-sm text-white/80 mt-2">Order ID: {orderId}</p>
              )}
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              {/* Amount Display */}
              {amount && (
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}

              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  Scan QR Code to Pay
                </h3>
                
                {qrCodeUrl ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                  >
                    <img 
                      src={qrCodeUrl} 
                      alt="Payment QR Code"
                      className="w-64 h-64"
                    />
                  </motion.div>
                ) : (
                  <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">OR</span>
                </div>
              </div>

              {/* Payment Link Button */}
              <div className="space-y-3">
                <Button
                  onClick={() => window.open(paymentLink, '_blank')}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Open Payment Page
                  <span className="ml-2">→</span>
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure payment powered by Razorpay</span>
                </div>
              </div>

              {/* Copy Link */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Payment Link:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paymentLink}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 rounded border text-muted-foreground"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentLink)
                      alert("Payment link copied!")
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {/* Return to Shop */}
              <div className="pt-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/")}
                  className="w-full"
                >
                  ← Return to Shop
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">📱 How to Pay:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Scan the QR code above with any UPI app</li>
                <li>Or click "Open Payment Page" to pay via web browser</li>
                <li>Complete the payment using your preferred method</li>
                <li>You'll receive an email confirmation once payment is successful</li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
