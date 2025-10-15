# Email Receipt Setup Guide

## Overview
When a customer completes checkout, the application sends:
1. **Customer Receipt**: Email to the buyer's email address
2. **Admin Copy**: Email to both:
   - `uvicornshoppie@gmail.com` (admin account)
   - The owner email configured in the environment

## Setup Instructions

### 1. Get a Resend API Key
1. Sign up at [Resend](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys)
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Verify Your Domain (For Production)
To send emails to any address (not just test addresses):
1. Add your domain in Resend
2. Add the provided DNS records to your domain
3. Wait for verification (usually a few minutes)

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory with:

```env
# Required: Your Resend API key
RESEND_API_KEY=re_your_actual_api_key_here

# Required for production: Sender email (must use verified domain)
FROM_SENDER="Uvicorn Orders <orders@yourdomain.com>"

# Required for production: Allow sending to any email
ALLOW_ALL_EMAILS=true

# Optional: Test email for development
RESEND_TEST_TO=your-test-email@example.com
```

### 4. Development vs Production

#### Development Mode (No Verified Domain)
- Emails will be **simulated** (logged but not sent)
- Or sent only to test addresses if `RESEND_TEST_TO` is configured
- You'll see simulation messages in the API response

#### Production Mode (With Verified Domain)
- Set `ALLOW_ALL_EMAILS=true`
- Set `FROM_SENDER` to an email using your verified domain
- Emails will be sent to:
  - The customer's email address
  - `uvicornshoppie@gmail.com` (admin)
  - Any additional owner email configured

## Admin Email Recipients

The admin copy is sent to:
- **Primary Admin**: `uvicornshoppie@gmail.com` (hardcoded)
- **Secondary Owner**: Configured via `RESEND_TEST_TO` environment variable

The admin email includes:
- A highlighted admin notification banner
- Customer's email address
- Complete order details
- Order ID and invoice information

## Testing

### Test the Email Flow
1. Start the development server: `pnpm dev`
2. Add items to cart
3. Enter an email at checkout
4. Check the response for email status

### Expected Responses
- `emailed: true` - Customer email sent successfully
- `emailSimulated: true` - Email was simulated (dev mode)
- `emailedOwner: true` - Admin copy sent successfully
- `ownerSimulated: true` - Admin copy was simulated (dev mode)

## Troubleshooting

### "Email simulated" Message
This means emails aren't being sent. Check:
- Is `RESEND_API_KEY` set correctly?
- Does it start with `re_`?
- Is `ALLOW_ALL_EMAILS=true` in production?
- Is your domain verified in Resend?

### "API key is invalid"
- Verify your API key is active in Resend
- Make sure you copied it completely
- Check for extra spaces or quotes

### Emails Not Received
- Check spam/junk folder
- Verify domain is verified in Resend
- Check Resend dashboard for delivery logs
- Ensure `FROM_SENDER` uses your verified domain

## Security Notes
- Never commit `.env.local` to version control
- Keep your API key secret
- Use environment variables for all sensitive data
- The admin email `uvicornshoppie@gmail.com` is hardcoded in the source

## Support
For Resend-specific issues, check:
- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
