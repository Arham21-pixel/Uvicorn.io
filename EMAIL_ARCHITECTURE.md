# 📧 Complete Email System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHOPPING CART APPLICATION                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Customer adds items
                                │ and checks out
                                ▼
                    ┌───────────────────────┐
                    │   Cart Panel          │
                    │   (cart-panel.tsx)    │
                    │                       │
                    │ • User enters email   │
                    │ • Validates email     │
                    │ • Sends to API        │
                    └───────────────────────┘
                                │
                                │ POST /api/checkout
                                │ { email, cart, amounts }
                                ▼
        ┌───────────────────────────────────────────────┐
        │     Checkout API (route.tsx)                  │
        │                                               │
        │  1. Validate email & cart                    │
        │  2. Generate Order ID (ORD-XXXXX)           │
        │  3. Create HTML receipt                      │
        │  4. Check Resend API key                     │
        └───────────────────────────────────────────────┘
                                │
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
        ┌─────────────────────┐ ┌─────────────────────┐
        │  BUYER EMAIL         │ │  ADMIN EMAIL         │
        │  PROCESS            │ │  PROCESS            │
        └─────────────────────┘ └─────────────────────┘
                    │                       │
                    │                       │
                    ▼                       ▼
        ┌─────────────────────┐ ┌─────────────────────┐
        │ Check if can send:  │ │ Check if can send:  │
        │ • Has valid API key │ │ • Has valid API key │
        │ • Using resend.dev  │ │ • Using resend.dev  │
        │   OR                │ │   OR                │
        │ • ALLOW_ALL_EMAILS  │ │ • ALLOW_ALL_EMAILS  │
        └─────────────────────┘ └─────────────────────┘
                    │                       │
                    │ ✅ YES                │ ✅ YES
                    ▼                       ▼
        ┌─────────────────────┐ ┌─────────────────────┐
        │   Resend API        │ │   Resend API        │
        │   resend.send()     │ │   resend.send()     │
        └─────────────────────┘ └─────────────────────┘
                    │                       │
                    │                       │
                    ▼                       ▼
        ┌─────────────────────┐ ┌─────────────────────┐
        │  📧 Email Sent to:  │ │  📧 Email Sent to:  │
        │                     │ │                     │
        │  customer@gmail.com │ │  uvicornshoppie@    │
        │                     │ │  gmail.com          │
        │  SUBJECT:           │ │                     │
        │  Uvicorn Order      │ │  SUBJECT:           │
        │  ORD-XXXXX          │ │  [ADMIN COPY]       │
        │                     │ │  Uvicorn Order XXX  │
        │  CONTENT:           │ │                     │
        │  • Thank you        │ │  CONTENT:           │
        │  • Order items      │ │  • 🔔 Admin Banner  │
        │  • Prices           │ │  • Customer email   │
        │  • Totals           │ │  • Order items      │
        │                     │ │  • Prices & totals  │
        └─────────────────────┘ └─────────────────────┘
                    │                       │
                    │                       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Return Response     │
                    │   to Frontend         │
                    │                       │
                    │   {                   │
                    │     orderId,          │
                    │     emailed: true,    │
                    │     emailedOwner: true│
                    │   }                   │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Show Success        │
                    │   Message to User     │
                    │                       │
                    │   "Order #ORD-XXX     │
                    │    confirmed.         │
                    │    Receipt emailed."  │
                    └───────────────────────┘
```

---

## Email Routing Logic

### Buyer Email Path

```
Buyer enters: customer@example.com
                    ↓
        [Normalize & Validate Email]
                    ↓
        recipientEmail = "customer@example.com"
                    ↓
        ┌──────────────────────────────┐
        │ Can send buyer email?        │
        │                              │
        │ hasValidKey = true?          │
        │   AND                        │
        │ (IS_RESEND_DEV_SENDER        │
        │  OR ALLOW_ALL_EMAILS)?       │
        └──────────────────────────────┘
                    ↓
                ✅ YES
                    ↓
        ┌──────────────────────────────┐
        │ Send via Resend API          │
        │                              │
        │ FROM: Uvicorn Orders         │
        │       <onboarding@resend.dev>│
        │ TO: customer@example.com     │
        │ SUBJECT: Uvicorn Order XXX   │
        │ REPLY-TO: customer@example.com│
        └──────────────────────────────┘
                    ↓
        📧 Email delivered to buyer
```

### Admin Email Path

```
Admin email: uvicornshoppie@gmail.com
                    ↓
        [Build Admin Recipients List]
                    ↓
        adminRecipients = [
          "uvicornshoppie@gmail.com"
        ]
                    ↓
        ┌──────────────────────────────┐
        │ Can send admin email?        │
        │                              │
        │ hasValidKey = true?          │
        │   AND                        │
        │ adminRecipients.length > 0?  │
        │   AND                        │
        │ (IS_RESEND_DEV_SENDER        │
        │  OR ALLOW_ALL_EMAILS)?       │
        └──────────────────────────────┘
                    ↓
                ✅ YES
                    ↓
        ┌──────────────────────────────┐
        │ Send via Resend API          │
        │                              │
        │ FROM: Uvicorn Orders         │
        │       <onboarding@resend.dev>│
        │ TO: uvicornshoppie@gmail.com │
        │ SUBJECT: [ADMIN COPY]        │
        │          Uvicorn Order XXX   │
        │                              │
        │ HTML: Admin banner +         │
        │       Order details          │
        └──────────────────────────────┘
                    ↓
        📧 Email delivered to admin
```

---

## Configuration Flow

```
┌─────────────────────────────────────┐
│     Environment Variables           │
│     (.env.local)                    │
│                                     │
│  RESEND_API_KEY=re_xxxxx           │
│  FROM_SENDER=optional              │
│  ALLOW_ALL_EMAILS=optional         │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│     Constants Initialization        │
│                                     │
│  DEFAULT_FROM =                    │
│    "Uvicorn Orders                 │
│     <onboarding@resend.dev>"       │
│                                     │
│  IS_RESEND_DEV_SENDER = true       │
│    (using resend.dev domain)       │
│                                     │
│  DEFAULT_OWNER =                   │
│    "uvicornshoppie@gmail.com"      │
│                                     │
│  ADMIN_EMAIL =                     │
│    "uvicornshoppie@gmail.com"      │
│                                     │
│  HAS_VALID_RESEND_KEY =            │
│    check if key starts with "re_"  │
└─────────────────────────────────────┘
                │
                ▼
        Email sending enabled! ✅
```

---

## Data Flow

### Request Flow
```
Client (Browser)
    ↓
    POST /api/checkout
    {
      email: "customer@gmail.com",
      cart: {
        items: [
          {
            product: { id, name, price },
            quantity: 2
          }
        ]
      },
      amounts: {
        subtotal: 5498,
        tax: 989.64,
        total: 6487.64
      }
    }
    ↓
Server (Next.js API Route)
    ↓
1. Validate cart & email
2. Generate Order ID
3. Create HTML receipt
4. Send buyer email
5. Send admin email
    ↓
Response
    {
      orderId: "ORD-MGLV75CV",
      emailed: true,
      emailSimulated: false,
      recipients: ["customer@gmail.com"],
      emailedOwner: true,
      ownerSimulated: false,
      adminRecipients: ["uvicornshoppie@gmail.com"]
    }
    ↓
Client (Browser)
    Shows success message
```

---

## Email Template Structure

```
┌─────────────────────────────────────────────┐
│  BUYER EMAIL                                │
├─────────────────────────────────────────────┤
│                                             │
│  Order Confirmation - ORD-XXXXX             │
│                                             │
│  Thank you for your purchase from Uvicorn.  │
│                                             │
│  Receipt recipient: customer@email.com      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  ITEMS TABLE                        │   │
│  │  • Item name                        │   │
│  │  • Quantity                         │   │
│  │  • Price                            │   │
│  │  • Line total                       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Subtotal: ₹X,XXX.XX                        │
│  GST (18%): ₹XXX.XX                         │
│  Total: ₹X,XXX.XX                           │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ADMIN EMAIL                                │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🔔 Admin Notification                 │ │
│  │ This is an admin copy of the order    │ │
│  │ receipt.                              │ │
│  │ Customer email: customer@email.com    │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Order Confirmation - ORD-XXXXX             │
│                                             │
│  Thank you for your purchase from Uvicorn.  │
│                                             │
│  Receipt recipient: customer@email.com      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  ITEMS TABLE                        │   │
│  │  (Same as buyer email)              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Subtotal, GST, Total                       │
│  (Same as buyer email)                      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
                [POST /api/checkout]
                        │
                        ▼
            ┌───────────────────────┐
            │ Validate Request      │
            └───────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ❌ Empty cart   ❌ Invalid     ✅ Valid
                    email
        │               │               │
        ▼               ▼               ▼
   Return 400    Return 400      Continue
   {error}       {error}              │
                                      ▼
                        ┌───────────────────────┐
                        │ Try Send Buyer Email  │
                        └───────────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                        ▼                           ▼
                    ✅ Success                  ❌ Error
                        │                           │
                emailed: true                emailed: false
                        │                   emailSimulated: true
                        │                        note: "..."
                        │                           │
                        └─────────────┬─────────────┘
                                      ▼
                        ┌───────────────────────┐
                        │ Try Send Admin Email  │
                        └───────────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                        ▼                           ▼
                    ✅ Success                  ❌ Error
                        │                           │
                emailedOwner: true        emailedOwner: false
                        │                  ownerSimulated: true
                        │                    ownerNote: "..."
                        │                           │
                        └─────────────┬─────────────┘
                                      ▼
                        ┌───────────────────────┐
                        │ Return Success (200)  │
                        │ With status details   │
                        └───────────────────────┘
```

---

## Summary

### Key Components
1. **Cart Panel** - Collects user email and cart data
2. **Checkout API** - Processes order and sends emails
3. **Resend API** - Email delivery service
4. **Email Templates** - HTML formatted receipts

### Email Recipients
- **Buyer**: Gets order confirmation
- **Admin**: `uvicornshoppie@gmail.com` gets copy of all orders

### Email Sender
- Default: `Uvicorn Orders <onboarding@resend.dev>`
- Can be customized with verified domain

### Success Criteria
- ✅ Buyer receives email at their address
- ✅ Admin receives copy at uvicornshoppie@gmail.com
- ✅ Both emails contain complete order details
- ✅ Admin email has notification banner
- ✅ No errors in API response
