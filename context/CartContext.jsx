import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!user) return setCart([]);
  const cartRef = doc(db, `users/${user.uid}/cart`, "main");
    const unsub = onSnapshot(cartRef, (snap) => {
      setCart(snap.data()?.items || []);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (cart.length === 0) return; // Don't save empty cart
    const cartRef = doc(db, `users/${user.uid}/cart`, "main");
    (async () => {
      await setDoc(cartRef, { items: cart });
    })();
  }, [cart, user]);

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
