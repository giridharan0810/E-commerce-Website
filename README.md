E-Com Next.js

A modern, minimal e-commerce website built with Next.js, Tailwind CSS, shadcn/ui, Framer Motion, and Firebase. Designed for a responsive, mobile-first experience with a polished UI/UX and full shopping functionality.

Live Demo: https://e-commerce-website-flame-two.vercel.app/

Features

✅ Authentication: Email/Password, Google, OTP via Firebase Auth

✅ Firestore Database: Products, cart, wishlist, orders

✅ Firebase Storage: Product images

✅ Responsive Design: Mobile-first, bottom navbar for smaller screens

✅ UI/UX Enhancements: Page transitions & animations with Framer Motion, toast notifications

✅ SEO Friendly: Meta tags & optimized page structure

✅ Admin Panel: Manage products & carousel images

Setup Instructions

Clone the repository

git clone https://github.com/giridharan0810/E-commerce-Website.git
cd E-commerce-Website


Create .env.local and add your Firebase config:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id


Install dependencies

npm install


Run the development server

npm run dev


Open http://localhost:3000
 to view it in the browser.

Folder Structure
app/            # Next.js App Router pages
components/     # Reusable UI components
context/        # React Context Providers (Cart, Wishlist)
hooks/          # Custom hooks (useAuth, etc.)
lib/            # Firebase config & seed scripts
styles/         # Tailwind CSS & global styles

Seeding Firestore (Optional)

You can populate sample products by running the seed script:

node lib/firestoreSeed.js

License

This project is licensed under the MIT License — free to use, modify, and distribute.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...

Live Demo

Check the project live here:
https://e-commerce-website-flame-two.vercel.app/
