import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) return setWishlist([]);
  const wishlistRef = doc(db, `users/${user.uid}/wishlist`, "main");
    const unsub = onSnapshot(wishlistRef, (snap) => {
      setWishlist(snap.data()?.items || []);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (wishlist.length === 0) return; // Don't save empty wishlist
    const wishlistRef = doc(db, `users/${user.uid}/wishlist`, "main");
    (async () => {
      await setDoc(wishlistRef, { items: wishlist });
    })();
  }, [wishlist, user]);

  return <WishlistContext.Provider value={{ wishlist, setWishlist }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
