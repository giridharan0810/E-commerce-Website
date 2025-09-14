"use client";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");

  // Load saved address if available
  useEffect(() => {
    async function fetchAddress() {
      if (!user) return;
      const docRef = doc(db, "addresses", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setAddress(docSnap.data().address || "");
    }
    fetchAddress();
  }, [user]);

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleOrder = async () => {
    if (!user) return toast.error("Please login to place order.");
    if (!address.trim()) return toast.error("Please enter your shipping address.");
    if (!payment.trim()) return toast.error("Please enter payment details.");
    if (cart.length === 0) return toast.error("Cart is empty.");

    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        total,
        address,
        payment,
        createdAt: Timestamp.now(),
      });
      setCart([]);
      setSuccess(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 drop-shadow">
        Checkout
      </h2>

      {success ? (
        <Card className="p-6 text-center border-green-300 shadow-md">
          <h3 className="text-xl font-bold text-green-700">✅ Order Placed!</h3>
          <p className="text-gray-600 mt-2">
            Thank you for shopping with us. You will receive an email confirmation shortly.
          </p>
          <Button className="mt-4" onClick={() => (window.location.href = "/")}>
            Continue Shopping
          </Button>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-6">
            {/* Order Summary */}
            <div>
              <h3 className="font-bold mb-3 text-lg">🛒 Order Summary</h3>
              {cart.length === 0 ? (
                <div className="text-gray-500">Your cart is empty.</div>
              ) : (
                <ul className="mb-2 space-y-2">
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between items-center gap-2">
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.size} / {item.color}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity || 1}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="w-16 text-center"
                        />
                        <span className="font-bold text-blue-600">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 text-right font-bold text-xl">
                Total: <span className="text-blue-700">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Address Input */}
            <div>
              <h3 className="font-bold mb-2 text-lg">📍 Shipping Address</h3>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                className="w-full"
              />
            </div>

            {/* Payment Input */}
            <div>
              <h3 className="font-bold mb-2 text-lg">💳 Payment Details</h3>
              <Input
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                placeholder="Card number or UPI ID"
                className="w-full"
              />
            </div>

            {/* Place Order Button */}
            <Button
              className="w-full py-3 text-lg"
              onClick={handleOrder}
              disabled={loading || cart.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
