"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star, 
  Sparkles, 
  Check,
  Zap
} from "lucide-react";

export default function ProductCard({ product }) {
  const { cart, setCart } = useCart();
  const { wishlist, setWishlist } = useWishlist();
  const [showToast, setShowToast] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInCart) {
      setCart([...cart, { ...product, quantity: 1 }]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistAnimating(true);
    
    if (isInWishlist) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
    
    setTimeout(() => setIsWishlistAnimating(false), 600);
  };

  // Calculate discount percentage if original price exists
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="w-full"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`} className="block group">
          <Card className="rounded-2xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 relative">
            {/* Premium Badge */}
            {product.premium && (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                <Sparkles size={10} />
                <span>Premium</span>
              </div>
            )}

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercentage}%
              </div>
            )}

            <div className="relative overflow-hidden">
              {/* Product Image */}
              <div className="relative h-60 w-full overflow-hidden">
                <motion.img
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Image Loading Skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                )}

                {/* Quick View Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300"
                >
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Eye size={18} />
                    <span>Quick View</span>
                  </div>
                </motion.div>
              </div>

              {/* Wishlist Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className={`absolute top-3 right-3 p-2 rounded-full shadow-md z-10 ${
                  isInWishlist 
                    ? "bg-red-500 text-white" 
                    : "bg-white/90 hover:bg-white text-gray-700 backdrop-blur-sm"
                } transition-colors duration-300`}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <motion.div
                  animate={{ 
                    scale: isWishlistAnimating ? [1, 1.3, 1] : 1,
                    rotate: isWishlistAnimating ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <Heart
                    size={20}
                    fill={isInWishlist ? "currentColor" : "none"}
                  />
                </motion.div>
              </motion.button>
            </div>

            <CardContent className="p-5">
              {/* Product Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-amber-400">
                    {"★".repeat(Math.floor(product.rating))}
                    {"☆".repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                </div>
              )}

              {/* Product Name */}
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1 mb-2">
                {product.name}
              </h3>
              
              {/* Product Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Price Section */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-2xl text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    isInCart
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  }`}
                  disabled={isInCart}
                >
                  {isInCart ? (
                    <>
                      <Check size={18} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          </Card>
        </Link>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white shadow-xl rounded-xl px-6 py-4 flex items-center gap-3 border border-gray-200">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Added to cart!</p>
                <p className="text-sm text-gray-600">{product.name}</p>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}