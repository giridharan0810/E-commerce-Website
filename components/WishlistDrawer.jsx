"use client";
import { motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";

export default function WishlistDrawer({ open, onClose }) {
  const { wishlist, setWishlist } = useWishlist();
  const { cart, setCart } = useCart();

  const handleMoveToCart = (item) => {
    // Add to cart
    setCart([...cart, { ...item, quantity: 1 }]);
    // Remove from wishlist
    setWishlist(wishlist.filter((w) => w.id !== item.id));
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: open ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-80 md:w-96 bg-white shadow-2xl z-50 flex flex-col"
    >
      <div className="p-6 flex flex-col h-full">
        <h2 className="font-bold text-xl mb-4 text-blue-700 drop-shadow">Your Wishlist</h2>
        <div className="flex-1 overflow-y-auto space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-gray-500 text-center mt-8">Your wishlist is empty.</div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
                <Button size="sm" onClick={() => handleMoveToCart(item)}>
                  Move to Cart
                </Button>
              </div>
            ))
          )}
        </div>
        <Button className="mt-4 w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </motion.div>
  );
}
