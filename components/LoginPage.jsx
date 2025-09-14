"use client";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && auth) {
      // ✅ Render reCAPTCHA only once
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible", // or "normal" if you want to show it
            callback: (response) => {
              console.log("reCAPTCHA solved ✅", response);
            },
          }
        );
        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
        });
      }
    }
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleSendOtp = async () => {
    if (!phone || !phone.startsWith("+")) {
      alert("Enter phone number in international format (e.g. +919999999999)");
      return;
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmation(confirmationResult);
      setShowOtp(true);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("OTP error:", error);
      alert(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (confirmation) {
      try {
        const result = await confirmation.confirm(otp);
        // Set user ID as phone number in Firestore (optional, if needed)
        // You may want to update user profile or context here
        alert("Phone verified ✅");
      } catch (error) {
        console.error("OTP verification failed:", error);
        alert("Invalid OTP. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {/* Email Login */}
      <form className="flex flex-col gap-2" onSubmit={handleEmailLogin}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>

      {/* Google Login */}
      <Button variant="outline" className="mt-2" onClick={handleGoogleLogin}>
        Login with Google
      </Button>

      {/* Phone OTP Login */}
      <div className="mt-4">
        <Input
          type="tel"
          placeholder="+919999999999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button variant="outline" onClick={handleSendOtp}>
          Send OTP
        </Button>

        {/* reCAPTCHA container MUST exist */}
        <div id="recaptcha-container"></div>

        {showOtp && (
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
