# Email Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       CHECKOUT PROCESS                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Customer enters │
                    │  their email and │
                    │  clicks Checkout │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  POST request to │
                    │  /api/checkout   │
                    └──────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │         Process Order & Generate            │
        │         Order ID (ORD-XXX)                  │
        └─────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │         Generate HTML Receipt with:         │
        │         • Order items & quantities          │
        │         • Prices (in INR)                   │
        │         • Subtotal, GST (18%), Total        │
        └─────────────────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────┴─────────────────┐
            │                                   │
            ▼                                   ▼
  ┌──────────────────┐              ┌──────────────────────┐
  │  EMAIL #1:       │              │  EMAIL #2:           │
  │  Customer Copy   │              │  Admin Copy          │
  └──────────────────┘              └──────────────────────┘
            │                                   │
            ▼                                   ▼
  ┌──────────────────┐              ┌──────────────────────┐
  │ TO:              │              │ TO:                  │
  │ customer@email   │              │ • uvicornshoppie@    │
  │                  │              │   gmail.com          │
  │ SUBJECT:         │              │ • Owner email (if    │
  │ Uvicorn Order    │              │   configured)        │
  │ ORD-XXX          │              │                      │
  │                  │              │ SUBJECT:             │
  │ CONTENT:         │              │ [ADMIN COPY]         │
  │ • Thank you msg  │              │ Uvicorn Order XXX    │
  │ • Order table    │              │                      │
  │ • Totals         │              │ CONTENT:             │
  └──────────────────┘              │ • 🔔 Admin Banner    │
                                    │ • Customer email     │
                                    │ • Order table        │
                                    │ • Totals             │
                                    └──────────────────────┘
```

## Email Content Examples

### Customer Email
```
Subject: Uvicorn Order ORD-ABC123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Confirmation - ORD-ABC123

Thank you for your purchase from Uvicorn.

Receipt recipient: customer@example.com

┌──────────────┬─────┬─────────┬────────────┐
│ Item         │ Qty │  Price  │ Line Total │
├──────────────┼─────┼─────────┼────────────┤
│ Product A    │  2  │ ₹500.00 │ ₹1,000.00  │
│ Product B    │  1  │ ₹750.00 │   ₹750.00  │
└──────────────┴─────┴─────────┴────────────┘

Subtotal: ₹1,750.00
GST (18%): ₹315.00
Total: ₹2,065.00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Admin Email
```
Subject: [ADMIN COPY] Uvicorn Order ORD-ABC123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────────────┐
│ 🔔 Admin Notification                    │
│ This is an admin copy of the order       │
│ receipt. Customer email:                 │
│ customer@example.com                     │
└──────────────────────────────────────────┘

Order Confirmation - ORD-ABC123

Thank you for your purchase from Uvicorn.

Receipt recipient: customer@example.com

┌──────────────┬─────┬─────────┬────────────┐
│ Item         │ Qty │  Price  │ Line Total │
├──────────────┼─────┼─────────┼────────────┤
│ Product A    │  2  │ ₹500.00 │ ₹1,000.00  │
│ Product B    │  1  │ ₹750.00 │   ₹750.00  │
└──────────────┴─────┴─────────┴────────────┘

Subtotal: ₹1,750.00
GST (18%): ₹315.00
Total: ₹2,065.00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Configuration

### Required Environment Variables
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_SENDER="Uvicorn Orders <orders@yourdomain.com>"
ALLOW_ALL_EMAILS=true
```

### Hardcoded Admin Email
```typescript
const ADMIN_EMAIL = "uvicornshoppie@gmail.com"
```

This ensures the admin email is **always** sent to uvicornshoppie@gmail.com regardless of configuration.
