"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        setProducts(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const filtered = products.filter(
    (p) =>
      (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
      (!category || p.category === category)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 🔎 Search + Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <Input
          type="text"
          placeholder="🔍 Search products..."
          className="w-full md:w-1/3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-3 w-full md:w-1/3">
          <select
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
            className="rounded-xl"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* 🛒 Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <>
          <AnimatePresence>
            <motion.section
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.section>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-12 text-lg"
            >
              No products found. 🛒 Try a different search or category.
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
