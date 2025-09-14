"use client";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar";
import "../styles/globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { AnimatePresence, motion } from "framer-motion";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <AnimatePresence mode="wait">
                <motion.main
                  className="min-h-screen pb-16 pt-20 pb-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
              
                >
                  {children}
                </motion.main>
              </AnimatePresence>
              <BottomNavbar />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
