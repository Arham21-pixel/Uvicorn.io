# Razorpay Payment Integration - Setup Guide

This guide explains how to set up Razorpay payment gateway integration for the Uvicorn shopping cart application.

## Features

✅ **Payment Links** - Generate secure Razorpay payment links  
✅ **QR Code** - Display QR codes for UPI payments  
✅ **Email Integration** - Send receipts via Resend API  
✅ **Webhook Support** - Receive payment confirmation events  
✅ **Order Tracking** - Save orders with payment status

## Quick Setup

### 1. Sign up for Razorpay

1. Visit [https://razorpay.com](https://razorpay.com)
2. Create an account
3. Complete KYC verification (required for live mode)
4. Get your API keys from the dashboard

### 2. Get API Keys

**Test Keys (for development):**
1. Go to Razorpay Dashboard
2. Navigate to **Settings** → **API Keys**
3. Generate **Test Keys**
4. Copy `Key ID` and `Key Secret`

**Live Keys (for production):**
- Available after completing KYC
- Use the same process but select "Live Mode"

### 3. Configure Environment Variables

Update your `.env.local` file with your Razorpay credentials:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE

# App URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Important:**
- Never commit actual keys to Git
- Use test keys in development
- Switch to live keys only in production

### 4. Set Up Webhooks

Webhooks allow Razorpay to notify your app when payments are completed.

**Development (using ngrok or similar):**
1. Install ngrok: `npm install -g ngrok`
2. Start your app: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Go to Razorpay Dashboard → **Settings** → **Webhooks**
6. Click **+ Create Webhook**
7. Webhook URL: `https://abc123.ngrok.io/api/razorpay-webhook`
8. Select events: `payment_link.paid`, `payment_link.cancelled`, `payment_link.expired`
9. Copy the **Webhook Secret** and add to `.env.local`

**Production:**
1. Use your production domain (e.g., `https://uvicorn.com/api/razorpay-webhook`)
2. Ensure it's accessible via HTTPS
3. Configure in Razorpay dashboard

## How It Works

### Payment Flow

1. **Customer Checkout**
   - Customer adds items to cart
   - Enters email address
   - Clicks "Checkout"

2. **Payment Link Generation**
   - Backend calls Razorpay API
   - Creates a payment link with order details
   - Amount is converted to paise (₹100 = 10000 paise)

3. **Payment Page**
   - Customer is redirected to `/payment` page
   - Displays QR code for UPI payment
   - Shows payment link button

4. **Payment Completion**
   - Customer scans QR or clicks payment link
   - Pays via UPI/Card/Net Banking
   - Razorpay processes payment

5. **Webhook Notification**
   - Razorpay sends `payment_link.paid` event
   - Your webhook verifies signature
   - Updates order status in database

6. **Success Page**
   - Customer redirected to success page
   - Email receipt sent via Resend
   - Order saved to history

## API Endpoints

### POST `/api/create-payment-link`

Creates a Razorpay payment link.

**Request:**
```json
{
  "amount": 150.00,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "orderId": "ORD-ABC123"
}
```

**Response:**
```json
{
  "ok": true,
  "link": "https://rzp.io/i/xyz123",
  "paymentLinkId": "plink_abc123",
  "raw": { /* full Razorpay response */ }
}
```

### POST `/api/razorpay-webhook`

Receives payment notifications from Razorpay.

**Headers:**
- `x-razorpay-signature`: Webhook signature for verification

**Events Handled:**
- `payment_link.paid` - Payment successful
- `payment_link.cancelled` - Payment cancelled
- `payment_link.expired` - Payment link expired

## Testing

### Test Mode

1. Use test API keys
2. Use Razorpay test cards:
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date
   - **OTP:** 123456

3. Test UPI:
   - Use `success@razorpay` for successful payment
   - Use `failure@razorpay` for failed payment

### Verify Integration

1. Start the server: `npm run dev`
2. Add items to cart
3. Enter email and checkout
4. Verify payment page shows:
   - ✅ QR code
   - ✅ Payment link button
   - ✅ Correct amount
5. Complete test payment
6. Check webhook logs in terminal
7. Verify email receipt received

## Security Checklist

✅ **Never expose secrets**
- Keep API keys in `.env.local`
- Don't commit `.env.local` to Git
- Use environment variables

✅ **Verify webhooks**
- Always validate webhook signatures
- Use HTTPS in production
- Don't skip signature verification

✅ **Use HTTPS**
- Required for webhooks
- Required for secure checkout
- Use SSL certificates in production

✅ **Validate amounts**
- Verify amounts on server-side
- Don't trust client data
- Convert to paise correctly

## Production Deployment

### Pre-launch Checklist

- [ ] Complete Razorpay KYC verification
- [ ] Switch to live API keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure production webhook URL (HTTPS)
- [ ] Test with small real payment
- [ ] Set up proper error logging
- [ ] Configure email notifications
- [ ] Add Terms & Conditions link
- [ ] Add Privacy Policy link
- [ ] Ensure PCI DSS compliance

### Going Live

1. **Switch Keys:**
   ```bash
   RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
   ```

2. **Update Webhook:**
   - Production URL with HTTPS
   - New webhook secret

3. **Test Production:**
   - Make a small real transaction
   - Verify webhook received
   - Check email delivery
   - Confirm order saved

## Troubleshooting

### Payment link not generating

**Problem:** API returns error or null link

**Solutions:**
- Check if Razorpay keys are correct
- Verify keys are not expired
- Ensure account is active
- Check amount is > 0
- Review API error message in logs

### Webhook not working

**Problem:** Payments successful but webhook not received

**Solutions:**
- Verify webhook URL is accessible (HTTPS)
- Check webhook secret matches
- Review Razorpay webhook logs in dashboard
- Ensure signature verification is correct
- Check server logs for errors

### QR code not displaying

**Problem:** Payment page shows loading spinner

**Solutions:**
- Verify `qrcode` package is installed
- Check browser console for errors
- Ensure payment link is valid
- Try refreshing the page

### Amount mismatch

**Problem:** Incorrect amount shown

**Solutions:**
- Verify paise conversion (amount * 100)
- Check tax calculation
- Review cart total computation
- Ensure no rounding errors

## Support

- **Razorpay Docs:** [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Payment Links API:** [https://razorpay.com/docs/api/payment-links/](https://razorpay.com/docs/api/payment-links/)
- **Webhooks:** [https://razorpay.com/docs/webhooks/](https://razorpay.com/docs/webhooks/)
- **Test Cards:** [https://razorpay.com/docs/payments/payments/test-card-details/](https://razorpay.com/docs/payments/payments/test-card-details/)

## Alternative: Instamojo

If you prefer a simpler alternative:

1. Sign up at [https://instamojo.com](https://instamojo.com)
2. Create payment links from dashboard (no coding needed)
3. Or use their Payment Links API (similar to Razorpay)

---

**Made with ❤️ for Uvicorn Shopping Cart**
