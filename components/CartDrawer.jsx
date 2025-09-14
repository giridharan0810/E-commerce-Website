"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function CartDrawer({ open, onClose }) {
  const { cart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-600 hover:text-black transition" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 border-b pb-3"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-700 font-medium">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => alert("Proceed to checkout")}
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
