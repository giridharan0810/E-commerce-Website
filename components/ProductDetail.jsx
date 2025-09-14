"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { 
  Heart, 
  ShoppingCart, 
  Zap, 
  ArrowLeft, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Check
} from "lucide-react";

export default function ProductDetail({ productId }) {
  const { cart, setCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [address, setAddress] = useState("");
  const [showAddressPrompt, setShowAddressPrompt] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  // Fetch product
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch user address
  useEffect(() => {
    if (!user) return;
    const fetchAddress = async () => {
      try {
        const docRef = doc(db, "addresses", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAddress(docSnap.data().address || "");
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };
    fetchAddress();
  }, [user]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
  const colors = product.colors?.length ? product.colors : ["black", "white", "blue"];
  const images = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    if (!size || !color) {
      toast.error("Please select size and color first");
      return;
    }
    
    const newItem = { ...product, size, color, quantity: 1 };
    setCart((prev) => [...prev, newItem]);
    
    // Show success animation
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="text-green-500" size={16} />
        Added to cart successfully!
      </div>,
      { 
        duration: 2000,
        iconTheme: {
          primary: '#10B981',
          secondary: '#fff',
        }
      }
    );
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!size || !color) {
      toast.error("Please select size and color first");
      return;
    }
    
    // Replace cart with only the selected product
    setCart([{ ...product, size, color, quantity: 1 }]);
    
    // Route after cart update
    setTimeout(() => {
      if (address) {
        router.push(`/checkout?productId=${product.id}&size=${size}&color=${color}`);
      } else {
        setShowAddressPrompt(true);
      }
    }, 100);
  };

  const saveAddressAndCheckout = async () => {
    if (!address) return;
    setIsSavingAddress(true);
    try {
      await setDoc(doc(db, "addresses", user.uid), { address });
      setShowAddressPrompt(false);
      router.push(`/checkout?productId=${product.id}&size=${size}&color=${color}`);
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const navigateImage = (direction) => {
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % images.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          className: 'bg-white shadow-xl border border-gray-200',
          duration: 3000,
        }}
      />
      
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Main Image */}
          <div 
            className="relative h-96 md:h-[500px] w-full overflow-hidden rounded-2xl cursor-zoom-in bg-gray-100"
            onClick={() => setShowImageModal(true)}
          >
            <motion.img
              key={selectedImage}
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onLoad={() => setImageLoading(false)}
            />
            
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            
            {/* Wishlist Button */}
            {/* <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 hover:bg-white text-gray-700'
              }`}
            >
              <Heart 
                size={20} 
                fill={isWishlisted ? "currentColor" : "none"} 
              />
            </button> */}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto py-2">
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === idx 
                      ? 'border-blue-500 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Product Title and Price */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-blue-600">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>
            {product.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
              </div>
            )}
          </div>

          {/* Product Description */}
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Select Size</h3>
            <div className="flex gap-3 flex-wrap">
              {sizes.map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSize(s)}
                  className={`px-5 py-3 rounded-xl border transition-all ${
                    size === s
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Choose Color</h3>
            <div className="flex gap-3">
              {colors.map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setColor(c)}
                  className={`h-12 w-12 rounded-full border-2 transition-all flex items-center justify-center ${
                    color === c 
                      ? "border-blue-600 scale-110 shadow-md" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color: ${c}`}
                >
                  {color === c && <Check size={16} className="text-white mix-blend-difference" />}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!size || !color}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={!size || !color}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
            >
              <Zap size={20} />
              Buy Now
            </motion.button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <Truck size={20} className="text-blue-500" />
              <span>Free shipping</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <RotateCcw size={20} className="text-blue-500" />
              <span>30-day returns</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Shield size={20} className="text-blue-500" />
              <span>2-year warranty</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Address Prompt Modal */}
      <AnimatePresence>
        {showAddressPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddressPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="text-blue-500" size={20} />
                  Shipping Address
                </h3>
                <button 
                  onClick={() => setShowAddressPrompt(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">Please enter your address to proceed with checkout</p>
              
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                className="mb-4"
              />
              
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={saveAddressAndCheckout}
                  disabled={isSavingAddress || !address}
                >
                  {isSavingAddress ? "Saving..." : "Save & Continue"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddressPrompt(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <button 
              className="absolute top-4 right-4 text-white p-2 z-10"
              onClick={() => setShowImageModal(false)}
            >
              <X size={28} />
            </button>
            
            <button 
              className="absolute left-4 text-white p-2 z-10 bg-black/30 rounded-full"
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            >
              <ChevronLeft size={32} />
            </button>
            
            <button 
              className="absolute right-4 text-white p-2 z-10 bg-black/30 rounded-full"
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
            >
              <ChevronRight size={32} />
            </button>
            
            <motion.img
              key={selectedImage}
              src={images[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}