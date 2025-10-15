# 🚀 QUICK START GUIDE - 3 Minutes to Working Email Receipts

## ⚡ Super Fast Setup

### Step 1: Get Resend API Key (2 minutes)

1. Go to https://resend.com
2. Sign up (or login)
3. Click **"API Keys"** in sidebar
4. Click **"Create API Key"**
5. Copy the key (starts with `re_`)

### Step 2: Add API Key to Your Project (30 seconds)

Create file `.env.local` in project root:

```env
RESEND_API_KEY=re_paste_your_key_here
```

**Important**: Replace `re_paste_your_key_here` with your actual API key!

### Step 3: Run & Test (30 seconds)

```bash
npm run dev
```

1. Open http://localhost:3000
2. Add items to cart
3. Checkout with any email
4. ✅ Done! Check both emails!

---

## 📧 What You'll Get

### Buyer (customer@example.com):
```
📧 Uvicorn Order ORD-XXXXX
   • Order confirmation
   • Items & prices
   • Total amount
```

### Admin (uvicornshoppie@gmail.com):
```
📧 [ADMIN COPY] Uvicorn Order ORD-XXXXX
   • 🔔 Admin banner
   • Customer's email
   • Same order details
```

---

## ❓ Troubleshooting (If emails don't work)

### Problem: "Email simulated" message

**Fix**:
```bash
# 1. Check .env.local file exists in project root
# 2. Check API key starts with "re_"
# 3. Restart dev server:
npm run dev
```

### Problem: Emails not received

**Fix**:
- Check spam/junk folder
- Verify API key at https://resend.com/api-keys
- Check Resend dashboard: https://resend.com/emails

---

## ✅ Success Checklist

- [ ] Created `.env.local` file
- [ ] Added `RESEND_API_KEY=re_...`
- [ ] Restarted dev server
- [ ] Made test purchase
- [ ] Buyer received email ✅
- [ ] Admin (uvicornshoppie@gmail.com) received copy ✅

---

## 🎉 That's It!

Your email receipt system is now working!

### What's Configured:
- ✅ **Buyer emails**: To customer's email address
- ✅ **Admin emails**: To `uvicornshoppie@gmail.com`
- ✅ **Sender**: `Uvicorn Orders <onboarding@resend.dev>`
- ✅ **Format**: Professional HTML receipts
- ✅ **Currency**: Indian Rupees (₹)
- ✅ **Tax**: 18% GST

### Need More Info?
Check these detailed docs:
- `README_EMAIL_SYSTEM.md` - Complete guide
- `EMAIL_FIX_COMPLETE.md` - What was fixed
- `EMAIL_TEST_CHECKLIST.md` - Testing steps
- `EMAIL_ARCHITECTURE.md` - System architecture

---

**Last Updated**: October 15, 2025  
**Status**: ✅ WORKING  
**Setup Time**: ~3 minutes
