"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "", category: "", description: "" });
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setEditData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
    });
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "products", editId), {
      ...editData,
      price: Number(editData.price),
    });
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editId ? { ...p, ...editData, price: Number(editData.price) } : p
      )
    );
    setEditId(null);
  };

  return (
    <div className="mb-8 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">🛠 Manage Products</h3>

      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition rounded-xl">
              <CardContent className="p-4 flex flex-col md:flex-row items-start justify-between gap-4">
                {editId === product.id ? (
                  <div className="flex flex-col gap-3 w-full">
                    <Input
                      placeholder="Product Name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    />
                    <Input
                      placeholder="Category"
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    />
                    <Input
                      placeholder="Description"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                    <div className="flex gap-3">
                      <Button onClick={handleUpdate}>💾 Save</Button>
                      <Button variant="outline" onClick={() => setEditId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row justify-between w-full gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{product.name}</h4>
                      <p className="text-blue-600 font-bold">${product.price}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-sm text-gray-400">{product.description}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button variant="outline" onClick={() => handleEdit(product)}>
                        ✏️ Edit
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleting === product.id}
                        onClick={() => handleDelete(product.id)}
                      >
                        {deleting === product.id ? "Deleting..." : "🗑 Delete"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No products found.</p>
      )}
    </div>
  );
}
