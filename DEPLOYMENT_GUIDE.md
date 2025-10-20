# Vercel Deployment Guide - Quick Start

## 🚀 Deploy Now (Without Razorpay)

Your code is ready to deploy! Follow these simple steps:

### Step 1: Go to Vercel
1. Visit: **https://vercel.com**
2. Click **"Sign Up"** (if new) or **"Login"**
3. Choose **"Continue with GitHub"**

### Step 2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Find **"Uvicorn.io"** in your list
3. Click **"Import"**

### Step 3: Configure Environment Variables

Click **"Environment Variables"** and add these (copy-paste exactly):

#### Required Variables (Copy These):

**Name:** `RESEND_API_KEY`  
**Value:** `re_Vik9a1hZ_HqgRgmkJVixYiBj3FBagypco`

**Name:** `NEXT_PUBLIC_SUPABASE_URL`  
**Value:** `https://lpglfcwgpehlhchjdrfp.supabase.co`

**Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2xmY3dncGVobGhjaGpkcmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjk1NjEsImV4cCI6MjA3NTYwNTU2MX0.930-uDk2EVR_aTVZYXuJDvTbi5HLrMkchRCHhV4zieE`

**Name:** `NEXT_PUBLIC_APP_URL`  
**Value:** `https://your-app-name.vercel.app` *(You'll update this after deployment)*

#### Optional (Leave These for Now):

**Name:** `RAZORPAY_KEY_ID`  
**Value:** `rzp_test_YOUR_KEY_ID` *(Add real key later)*

**Name:** `RAZORPAY_KEY_SECRET`  
**Value:** `YOUR_KEY_SECRET` *(Add real key later)*

**Name:** `RAZORPAY_WEBHOOK_SECRET`  
**Value:** `YOUR_WEBHOOK_SECRET` *(Add real key later)*

### Step 4: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. 🎉 Done! Your app is live!

### Step 5: Update App URL
Once deployed, Vercel gives you a URL like: `https://uvicorn-io-xyz123.vercel.app`

1. Copy your Vercel URL
2. Go to **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_APP_URL`
4. Paste your actual URL
5. Click **"Save"**
6. Vercel will auto-redeploy

---

## ✅ What Works Without Razorpay

Your app will work perfectly for testing:

✅ **Full Shopping Experience**
- Browse products
- Search functionality
- Add to cart
- Wishlist items
- View order history
- Diwali sale banner

✅ **Checkout & Orders**
- Place orders
- Receive email receipts
- Order confirmation
- Order history saved

❌ **Payment (After You Add Razorpay)**
- Payment link generation (skipped for now)
- QR code display (skipped for now)

---

## 📱 After Deployment - What to Do

### 1. Test Your Deployed App
Visit your Vercel URL and test:
- [ ] Can browse products?
- [ ] Can add to cart?
- [ ] Can checkout with email?
- [ ] Received email receipt?
- [ ] Order saved to history?

### 2. Copy Your Vercel URL
**Your URL:** `_______________________________`

Keep this handy - you'll need it for Razorpay configuration.

### 3. Add Razorpay Later (When Ready)

**When you want to enable payments:**

1. **Get Razorpay Account:**
   - Sign up: https://razorpay.com
   - Get TEST keys from dashboard

2. **Update Vercel Environment Variables:**
   - Go to Settings → Environment Variables
   - Update these with real values:
     - `RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`
     - `RAZORPAY_WEBHOOK_SECRET`

3. **Configure Webhook:**
   - Razorpay Dashboard → Webhooks
   - Add URL: `https://your-vercel-url.vercel.app/api/razorpay-webhook`
   - Select events: `payment_link.paid`, `payment_link.cancelled`, `payment_link.expired`

4. **Test Payments:**
   - Use test card: `4111 1111 1111 1111`
   - CVV: `123`, Expiry: `12/25`, OTP: `123456`

---

## 🔄 Auto-Deploy on Git Push

After initial deployment, every time you:
```bash
git push origin main
```
Vercel will automatically deploy the changes! 🚀

---

## 📞 Need Help?

**Vercel Issues:**
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure no missing dependencies

**App Issues:**
- Check browser console for errors
- View server logs in Vercel
- Test locally first with `npm run dev`

---

## 🎯 Quick Checklist

- [ ] Created Vercel account
- [ ] Connected GitHub
- [ ] Imported Uvicorn.io repository
- [ ] Added environment variables (3 required ones)
- [ ] Clicked Deploy
- [ ] Waited for build to complete
- [ ] Copied Vercel URL
- [ ] Updated `NEXT_PUBLIC_APP_URL` variable
- [ ] Tested deployed app
- [ ] Everything works! 🎉

---

**Your app is production-ready without payments. Add Razorpay whenever you're ready!** 💰

Deploy Link: **https://vercel.com/new**
