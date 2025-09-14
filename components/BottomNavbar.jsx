"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Heart, User } from "lucide-react";

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: <Home size={22} /> },
    { href: "/cart", label: "Cart", icon: <ShoppingCart size={22} /> },
    { href: "/wishlist", label: "Wishlist", icon: <Heart size={22} /> },
    { href: "/profile", label: "Profile", icon: <User size={22} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center py-2 md:hidden z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <button
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 
                ${isActive ? "text-blue-600 font-semibold scale-110" : "text-gray-600 hover:text-blue-500"}`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
