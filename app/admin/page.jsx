"use client";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import AdminProductList from "../../components/AdminProductList";

export default function AdminPanel() {
  const [product, setProduct] = useState({ name: "", price: "", images: [""], category: "", description: "", colors: [], sizes: [] });
  const [carousel, setCarousel] = useState({ image: "", title: "", description: "", productId: "" });
  const [message, setMessage] = useState("");

  const handleProductChange = e => {
    const { name, value } = e.target;
    if (name === "images") {
      setProduct({ ...product, images: value.split(",").map(img => img.trim()) });
    } else if (name === "colors") {
      setProduct({ ...product, colors: value.split(",").map(c => c.trim()) });
    } else if (name === "sizes") {
      setProduct({ ...product, sizes: value.split(",").map(s => s.trim()) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };
  const handleCarouselChange = e => setCarousel({ ...carousel, [e.target.name]: e.target.value });

  const handleAddProduct = async () => {
    try {
  await addDoc(collection(db, "products"), { ...product, price: Number(product.price) });
  setMessage("Product added successfully!");
  setProduct({ name: "", price: "", images: [""], category: "", description: "", colors: [], sizes: [] });
    } catch (err) {
      setMessage("Error adding product: " + err.message);
    }
  };

  const handleAddCarousel = async () => {
    try {
      await addDoc(collection(db, "carousels"), carousel);
      setMessage("Carousel image added successfully!");
  setCarousel({ image: "", title: "", description: "", productId: "" });
    } catch (err) {
      setMessage("Error adding carousel image: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 drop-shadow">Admin Panel</h2>
      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}
      <Card className="mb-8">
        <CardContent>
          <h3 className="text-xl font-bold mb-4">Add Product</h3>
          <div className="flex flex-col gap-3">
            <Input name="name" placeholder="Product Name" value={product.name} onChange={handleProductChange} />
            <Input name="price" type="number" placeholder="Price" value={product.price} onChange={handleProductChange} />
            <Input name="images" placeholder="Image URLs (comma separated)" value={product.images.join(", ")} onChange={handleProductChange} />
            <Input name="category" placeholder="Category" value={product.category} onChange={handleProductChange} />
            <Input name="description" placeholder="Description" value={product.description} onChange={handleProductChange} />
            <Input name="colors" placeholder="Colors (comma separated)" value={product.colors.join(", ")} onChange={handleProductChange} />
            <Input name="sizes" placeholder="Sizes (comma separated)" value={product.sizes.join(", ")} onChange={handleProductChange} />
            <Button className="mt-2" onClick={handleAddProduct}>Add Product</Button>
          </div>
        </CardContent>
      </Card>
      <AdminProductList />
      <Card>
        <CardContent>
          <h3 className="text-xl font-bold mb-4">Add Carousel Image</h3>
          <div className="flex flex-col gap-3">
            <Input name="image" placeholder="Image URL" value={carousel.image} onChange={handleCarouselChange} />
            <Input name="title" placeholder="Title" value={carousel.title} onChange={handleCarouselChange} />
            <Input name="description" placeholder="Description" value={carousel.description} onChange={handleCarouselChange} />
            <Input name="productId" placeholder="Product ID (optional)" value={carousel.productId} onChange={handleCarouselChange} />
            <Button className="mt-2" onClick={handleAddCarousel}>Add Carousel Image</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
