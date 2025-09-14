"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ChevronLeft, ChevronRight, ArrowRight, Star, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";

export default function HomeCarousel() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 0: right, 1: left
  const [isHovered, setIsHovered] = useState(false);

  // Fetch slides from Firebase
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "carousels"));
        const slidesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          productId: doc.id,
        }));
        setSlides(slidesData);
      } catch (err) {
        console.error("Error fetching carousel data:", err);
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = () => {
    setDirection(0);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (i) => {
    setDirection(i > index ? 0 : 1);
    setIndex(i);
  };

  // Auto-play every 5 seconds only when not hovered
  useEffect(() => {
    if (slides.length === 0 || isHovered) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [index, slides.length, isHovered]);

  if (slides.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-12 h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading featured products...</p>
        </div>
      </div>
    );
  }

  const variants = {
    enter: (direction) => ({
      x: direction === 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction === 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto mb-16 overflow-hidden rounded-3xl shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 }
          }}
          className="relative"
        >
          <img
            src={slides[index].image}
            alt={slides[index].title}
            className="w-full h-80 sm:h-[500px] object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 text-white">
            <div className="max-w-2xl">
              {/* Badge */}
              {slides[index].badge && (
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg"
                >
                  {slides[index].badge}
                </motion.span>
              )}
              
              {/* Title */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-5xl font-bold mb-4 leading-tight drop-shadow-lg"
              >
                {slides[index].title}
              </motion.h2>
              
              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl mb-6 max-w-lg drop-shadow-md"
              >
                {slides[index].description}
              </motion.p>
              
              {/* Price & CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {slides[index].price && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">${slides[index].price}</span>
                    {slides[index].originalPrice && (
                      <span className="text-lg text-gray-300 line-through">${slides[index].originalPrice}</span>
                    )}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Link 
                    href={`/product/${slides[index].productId}`}
                    className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                  >
                    <ShoppingBag size={20} />
                    Shop Now
                  </Link>
                  
                  <button className="flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-all">
                    Learn More
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300 shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </motion.button>
      
      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300 shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </motion.button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goToSlide(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`h-3 rounded-full transition-all ${
              index === i 
                ? "bg-white w-8" 
                : "bg-white/50 hover:bg-white/80 w-3"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
        {index + 1} / {slides.length}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={index}
        />
      </div>
    </div>
  );
}