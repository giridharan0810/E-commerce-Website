"use client";
import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registered successfully!");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 shadow-lg rounded-xl bg-white">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 drop-shadow">Register</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
