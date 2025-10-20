import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-razorpay-signature') || ''
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || ''

    if (!secret) {
      console.warn('⚠️ RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    // Get raw body as text for signature verification
    const body = await req.text()
    
    // Verify signature
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (signature !== expected) {
      console.warn('❌ Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Parse the verified payload
    const payload = JSON.parse(body)
    const event = payload.event
    
    console.log('✅ Verified Razorpay webhook:', event)
    console.log('📦 Webhook payload:', JSON.stringify(payload, null, 2))

    // Handle different webhook events
    switch (event) {
      case 'payment_link.paid':
        // Payment successful
        const paymentLinkId = payload.payload?.payment_link?.entity?.id
        const paymentId = payload.payload?.payment?.entity?.id
        const amount = payload.payload?.payment?.entity?.amount / 100 // Convert from paise to rupees
        
        console.log('💰 Payment successful!')
        console.log('   Payment Link ID:', paymentLinkId)
        console.log('   Payment ID:', paymentId)
        console.log('   Amount:', amount, 'INR')
        
        // TODO: Update order status in your database here
        // Example: await updateOrderStatus(paymentLinkId, 'paid')
        
        break

      case 'payment_link.cancelled':
        console.log('❌ Payment link cancelled')
        // TODO: Handle cancellation
        break

      case 'payment_link.expired':
        console.log('⏰ Payment link expired')
        // TODO: Handle expiration
        break

      default:
        console.log('📨 Unhandled event:', event)
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 })
    
  } catch (err: any) {
    console.error('❌ Webhook processing error:', err.message)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
