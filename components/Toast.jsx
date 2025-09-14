"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
