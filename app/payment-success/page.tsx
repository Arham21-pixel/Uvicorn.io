"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

export default function PaymentSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4"
            >
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <CardTitle className="text-3xl font-bold">Payment Successful!</CardTitle>
          </CardHeader>

          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                Thank you for your payment!
              </p>
              <p className="text-sm text-muted-foreground">
                Your order has been confirmed and a receipt has been sent to your email.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <p className="text-sm text-muted-foreground mb-2">What happens next?</p>
              <ul className="text-xs text-left space-y-1 text-muted-foreground">
                <li>✓ Order confirmation sent to your email</li>
                <li>✓ Your order is being processed</li>
                <li>✓ You'll receive updates on your order status</li>
              </ul>
            </motion.div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full"
              >
                View My Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
