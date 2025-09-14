# E-Com Next.js

A modern, minimal e-commerce site built with Next.js, Tailwind CSS, shadcn/ui, Framer Motion, and Firebase.

## Features
- Firebase Auth (Email/Password, Google, OTP)
- Firestore for products, cart, wishlist, orders
- Firebase Storage for product images
- Responsive, mobile-first UI
- Bottom navbar on mobile
- Page transitions & animations
- Toast notifications
- SEO ready

## Setup
1. Clone repo
2. Add your Firebase config to `.env.local`
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`

## Folder Structure
- `app/` - Next.js App Router pages
- `components/` - UI components
- `context/` - React contexts
- `hooks/` - Custom hooks
- `lib/` - Firebase config & seed
- `styles/` - Tailwind & global CSS

## Seed Firestore
Run the seed script in `lib/firestoreSeed.js` to add sample products.

---
Replace placeholder values and assets as needed for production.
