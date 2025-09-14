"use client";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2, ChevronRight, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, setWishlist } = useWishlist();
  const { cart, setCart } = useCart();
  const [removingId, setRemovingId] = useState(null);
  const [movingId, setMovingId] = useState(null);
  const [showEmptyAnimation, setShowEmptyAnimation] = useState(false);

  useEffect(() => {
    if (wishlist.length === 0) {
      setShowEmptyAnimation(true);
    }
  }, [wishlist]);

  const handleMoveToCart = (item) => {
    setMovingId(item.id);
    
    setTimeout(() => {
      const exists = cart.find((c) => c.id === item.id);
      if (!exists) setCart([...cart, { ...item, quantity: 1 }]);
      setWishlist(wishlist.filter((w) => w.id !== item.id));
      setMovingId(null);
    }, 600);
  };

  const handleRemove = (id) => {
    setRemovingId(id);
    
    setTimeout(() => {
      setWishlist(wishlist.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 600);
  };

  const handleRemoveAll = () => {
    if (wishlist.length === 0) return;
    
    setWishlist([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="relative">
            <div className="absolute -inset-3 bg-blue-100 rounded-full opacity-60 blur"></div>
            <Heart className="relative text-blue-600" size={32} fill="currentColor" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Wishlist
          </h2>
          <span className="bg-blue-100 text-blue-600 font-semibold px-3 py-1 rounded-full text-sm">
            {wishlist.length} items
          </span>
        </div>
        
        {wishlist.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleRemoveAll}
            className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
            Clear All
          </Button>
        )}
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 text-center ${showEmptyAnimation ? 'animate-fade-in' : ''}`}>
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
            <Heart className="relative text-blue-400" size={80} strokeWidth={1} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-md mb-8">
            Looks like you haven't added anything to your wishlist yet. Start exploring and add items you love!
          </p>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            Start Shopping
            <ChevronRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div 
              key={item.id} 
              className={`relative transition-all duration-500 ${removingId === item.id ? 'animate-slide-out' : movingId === item.id ? 'animate-fly-to-cart' : 'animate-fade-in'}`}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border-0 bg-white/70 backdrop-blur-sm relative">
                {/* Premium Badge */}
                {item.premium && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <Sparkles size={12} />
                    <span>Premium</span>
                  </div>
                )}
                
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={300}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <CardContent className="p-5">
                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 text-xl">${item.price.toFixed(2)}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all group/cart"
                    >
                      <ShoppingCart size={16} className="group-hover/cart:scale-110 transition-transform" />
                      <span>Move to Cart</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemove(item.id)}
                      className="px-3 text-gray-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
                
                {/* Hover effect */}
                <div className="absolute inset-0 border border-blue-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            </div>
          ))}
        </div>
      )}
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100px); }
        }
        @keyframes flyToCart {
          0% { transform: scale(1) rotate(0); opacity: 1; }
          50% { transform: scale(0.8) rotate(-5deg); opacity: 0.7; }
          100% { transform: scale(0.5) translate(100px, -100px) rotate(-10deg); opacity: 0; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-out {
          animation: slideOut 0.6s ease-in forwards;
        }
        .animate-fly-to-cart {
          animation: flyToCart 0.6s ease-in forwards;
        }
      `}</style>
    </div>
  );
}