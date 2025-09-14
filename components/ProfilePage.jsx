"use client";
import { useAuth } from "../hooks/useAuth";
import { auth, db } from "../lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { signOut, updateProfile, updateEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");

  // Fetch address
  useEffect(() => {
    async function fetchAddress() {
      if (!user) return;
      const docRef = doc(db, "addresses", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setAddress(docSnap.data().address || "");
    }
    fetchAddress();
  }, [user]);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setOrders(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchOrders();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Update Firebase Auth profile
      if (name !== user.displayName) await updateProfile(user, { displayName: name });
      if (email !== user.email) await updateEmail(user, email);

      // Update address in Firestore
      await setDoc(doc(db, "addresses", user.uid), { address }, { merge: true });
      setEditing(false);
    } catch (error) {
      alert("Failed to save profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) return <div className="text-center mt-8">Please login to view your profile.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 drop-shadow">Profile</h2>

      <Card className="mb-6">
        <CardContent className="space-y-4">
          {/* Editable fields */}
          {editing ? (
            <div className="space-y-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
              />
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>
              <p><strong>Address:</strong> {address || "No address set."}</p>
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            </div>
          )}

          <Button variant="destructive" className="w-full mt-2" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <h3 className="text-xl font-bold mb-3">My Orders</h3>
      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  Total: <span className="font-bold text-blue-600">${order.total}</span>
                </p>
                <p className="text-sm">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-400">
                  Placed on {order.createdAt?.toDate().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 mt-4 text-center">
          You haven’t placed any orders yet.
        </div>
      )}
    </div>
  );
}
