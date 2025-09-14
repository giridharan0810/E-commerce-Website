"use client";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user } = useAuth();
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to close both menus
  const closeMenus = () => {
    setShowDesktopMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/30 border-b border-white/20 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          {/* Brand / Logo */}
          <Link href="/" className="font-extrabold text-2xl text-blue-700 tracking-wide hover:scale-105 transition-transform">
           E-com
          </Link>

          {/* Desktop / Mobile Buttons */}
          <div className="flex gap-3 items-center">
            {!isMobile && (
              <>
                <Link href="/cart" onClick={closeMenus}>
                  <Button variant="outline" className="rounded-full shadow hover:shadow-lg transition">
                    Cart
                  </Button>
                </Link>
                <Link href="/wishlist" onClick={closeMenus}>
                  <Button variant="outline" className="rounded-full shadow hover:shadow-lg transition">
                    Wishlist
                  </Button>
                </Link>

                {/* Desktop User Menu */}
                {user ? (
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-white/40 transition"
                      onClick={() => setShowDesktopMenu((v) => !v)}
                    >
                      <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        {user.displayName
                          ? user.displayName[0].toUpperCase()
                          : user.phoneNumber?.slice(-2) || "U"}
                      </span>
                      <span className="font-semibold text-blue-700 hidden sm:block">
                        {user.displayName || user.phoneNumber || "User"}
                      </span>
                    </button>

                    <AnimatePresence>
                      {showDesktopMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg border border-white/20"
                        >
                          <Link href="/profile" className="block px-4 py-2 hover:bg-blue-50 rounded-t-2xl" onClick={closeMenus}>
                            Profile
                          </Link>
                          <Link href="/admin" className="block px-4 py-2 hover:bg-blue-50" onClick={closeMenus}>
                            Admin Panel
                          </Link>
                          <button
                            onClick={closeMenus}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-2xl"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login" onClick={closeMenus}>
                    <Button className="rounded-full shadow hover:shadow-lg transition">
                      Login
                    </Button>
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button onClick={() => setShowMobileMenu((v) => !v)} className="p-2 rounded-md bg-blue-500 text-white">
                Menu
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobile && (
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-64 bg-white/95 backdrop-blur-md shadow-lg z-50 p-6 flex flex-col gap-4"
            >
              <Link href="/cart" onClick={closeMenus} className="hover:text-blue-700 font-semibold">Cart</Link>
              <Link href="/wishlist" onClick={closeMenus} className="hover:text-blue-700 font-semibold">Wishlist</Link>
              {user ? (
                <>
                  <Link href="/profile" onClick={closeMenus} className="hover:text-blue-700 font-semibold">Profile</Link>
                  <Link href="/admin" onClick={closeMenus} className="hover:text-blue-700 font-semibold">Admin Panel</Link>
                  <button className="text-red-600 hover:text-red-800 text-left font-semibold" onClick={closeMenus}>
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={closeMenus} className="hover:text-blue-700 font-semibold">Login</Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
