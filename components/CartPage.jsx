"use client";
import { useCart } from "../context/CartContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Image from "next/image";

export default function CartPage() {
  const { cart, setCart } = useCart();

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleQuantity = (id, qty) => {
    if (qty < 1) return;
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const handleSize = (id, size) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, size } : item)));
  };

  const handleColor = (id, color) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, color } : item)));
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 drop-shadow">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <Card key={item.id} className="shadow-md rounded-xl overflow-x-auto">
              <CardContent className="flex flex-col md:flex-row md:items-center gap-4 p-4 min-w-[320px]">
                
                {/* Product Info */}
                <div className="flex items-center gap-4 md:w-2/3">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{item.name}</span>
                    <span className="text-blue-600 font-bold">${item.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:w-1/3">
                  {/* Quantity */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      className="px-3 py-1 hover:bg-gray-200 transition"
                      onClick={() => handleQuantity(item.id, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity || 1}</span>
                    <button
                      className="px-3 py-1 hover:bg-gray-200 transition"
                      onClick={() => handleQuantity(item.id, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Size */}
                  <select
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    value={item.size || ""}
                    onChange={(e) => handleSize(item.id, e.target.value)}
                  >
                    <option value="">Size</option>
                    {item.sizes
                      ? item.sizes.map((s) => <option key={s} value={s}>{s}</option>)
                      : ["S", "M", "L", "XL"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>

                  {/* Color */}
                  <select
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    value={item.color || ""}
                    onChange={(e) => handleColor(item.id, e.target.value)}
                  >
                    <option value="">Color</option>
                    {item.colors
                      ? item.colors.map((c) => <option key={c} value={c}>{c}</option>)
                      : ["Black", "White", "Blue"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <Button
                    variant="outline"
                    className="hover:bg-red-100 hover:text-red-600 transition"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Cart Summary */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <span className="text-lg font-bold">
              Total: <span className="text-blue-700">${total.toFixed(2)}</span>
            </span>
            <Button className="w-full sm:w-auto" onClick={() => window.location.href = '/checkout'}>Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}
