# ✅ Email Receipt Testing Checklist

## Before Testing

- [ ] Resend API key is set in `.env.local`
  ```env
  RESEND_API_KEY=re_your_api_key_here
  ```
- [ ] Dev server is running (`npm run dev`)

## Test Scenario 1: Basic Checkout

### Steps
1. [ ] Open your shopping cart application
2. [ ] Add 1-2 products to cart
3. [ ] Click checkout
4. [ ] Enter a test email: `test123@example.com`
5. [ ] Complete checkout

### Expected Results
- [ ] Checkout success message appears
- [ ] Response shows:
  - `emailed: true`
  - `emailedOwner: true`
  - `emailSimulated: false`
  - `ownerSimulated: false`

### Verify Emails Received
- [ ] **Buyer email** (`test123@example.com`):
  - Subject: `Uvicorn Order ORD-XXXXX`
  - Contains order items and totals
  - Shows customer email in receipt

- [ ] **Admin email** (`uvicornshoppie@gmail.com`):
  - Subject: `[ADMIN COPY] Uvicorn Order ORD-XXXXX`
  - Has yellow admin notification banner
  - Shows customer's email: `test123@example.com`
  - Contains same order details

## Test Scenario 2: Different Email

### Steps
1. [ ] Add different products to cart
2. [ ] Checkout with different email: `buyer@gmail.com`
3. [ ] Complete checkout

### Expected Results
- [ ] **Buyer** (`buyer@gmail.com`) receives order confirmation
- [ ] **Admin** (`uvicornshoppie@gmail.com`) receives admin copy
- [ ] Customer email shown in admin copy is `buyer@gmail.com`

## Test Scenario 3: Admin Email Test

### Steps
1. [ ] Add products to cart
2. [ ] Checkout using admin email: `uvicornshoppie@gmail.com`
3. [ ] Complete checkout

### Expected Results
- [ ] Admin receives ONE email (not duplicate)
- [ ] Email subject: `[ADMIN COPY] Uvicorn Order ORD-XXXXX`
- [ ] Admin notification banner present
- [ ] Shows customer email as `uvicornshoppie@gmail.com`

## Test Scenario 4: Multiple Orders

### Steps
1. [ ] Place order #1 with email: `customer1@test.com`
2. [ ] Place order #2 with email: `customer2@test.com`
3. [ ] Place order #3 with email: `customer3@test.com`

### Expected Results
- [ ] Each customer receives their own order confirmation
- [ ] Admin (`uvicornshoppie@gmail.com`) receives 3 separate admin copies
- [ ] Each admin email shows different customer email
- [ ] Each order has unique Order ID

## Troubleshooting Checks

### If Buyers Don't Receive Emails

- [ ] Check Resend dashboard: https://resend.com/emails
- [ ] Verify API key starts with `re_`
- [ ] Check spam/junk folders
- [ ] Restart dev server after setting API key
- [ ] Check browser console for errors

### If Admin Doesn't Receive Emails

- [ ] Verify `uvicornshoppie@gmail.com` spam folder
- [ ] Check Resend dashboard for delivery status
- [ ] Verify code has: `const ADMIN_EMAIL = "uvicornshoppie@gmail.com"`
- [ ] Check API response shows `emailedOwner: true`

### If Emails Are "Simulated"

- [ ] API key is missing or invalid
- [ ] Check `.env.local` file exists in project root
- [ ] Verify API key format: `re_xxxxxxxxxx`
- [ ] Restart dev server
- [ ] Check Resend dashboard - is API key active?

## Success Criteria

✅ **All tests pass when**:
1. Every buyer email receives their order confirmation
2. Admin email (`uvicornshoppie@gmail.com`) receives copy of every order
3. Admin emails have notification banner and customer email
4. No "simulated" messages (emails actually send)
5. Multiple orders work correctly

## Email Content Verification

### Buyer Email Should Contain
- [ ] Order ID (e.g., `ORD-MGLV75CV`)
- [ ] "Thank you for your purchase from Uvicorn"
- [ ] Table with items, quantities, prices
- [ ] Subtotal, GST (18%), Total
- [ ] Buyer's email address

### Admin Email Should Contain
- [ ] 🔔 Admin Notification banner (yellow background)
- [ ] "This is an admin copy of the order receipt"
- [ ] Customer email displayed
- [ ] Order ID
- [ ] Same order details as buyer received
- [ ] Subject starts with `[ADMIN COPY]`

## Quick Reference

### Key Files
- **Checkout API**: `/app/api/checkout/route.tsx`
- **Environment**: `.env.local`
- **Cart Panel**: `/components/cart-panel.tsx`

### Key Variables
```typescript
const DEFAULT_OWNER = "uvicornshoppie@gmail.com"
const ADMIN_EMAIL = "uvicornshoppie@gmail.com"
const DEFAULT_FROM = "Uvicorn Orders <onboarding@resend.dev>"
```

### Environment Variables
```env
# Required
RESEND_API_KEY=re_your_key_here

# Optional (for custom domain)
FROM_SENDER="Your Shop <orders@yourdomain.com>"
ALLOW_ALL_EMAILS=true
```

---

**Status**: ⬜ Not Started | 🔄 In Progress | ✅ Complete | ❌ Failed

**Test Date**: __________

**Tested By**: __________

**Notes**:
