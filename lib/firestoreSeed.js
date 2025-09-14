import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const products = [
  {
    name: "Minimalist Sneakers",
    description: "Comfortable, stylish sneakers for everyday wear.",
    price: 79.99,
    image: "products/sneakers.jpg",
    category: "Shoes",
    tags: ["minimal", "new"],
    stock: 50,
  },
  {
    name: "Classic Tee",
    description: "Soft cotton t-shirt in classic colors.",
    price: 19.99,
    image: "products/tee.jpg",
    category: "Apparel",
    tags: ["bestseller"],
    stock: 100,
  },
  // ...more products
];

export async function seedProducts() {
  const productsRef = collection(db, "products");
  for (const product of products) {
    await addDoc(productsRef, product);
  }
}
