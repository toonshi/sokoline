"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingBag, Search, Menu, Package, LayoutDashboard, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const { cart } = useCart();
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white py-2 px-6">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
        
        {/* LEFT: LOGO & NAV */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              metric
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex text-lg font-semibold">
            <Link href="/products" className="hover:text-gray-500 transition-colors">
              Browse
            </Link>
            <Link href="/shops" className="hover:text-gray-500 transition-colors">
              Shops
            </Link>
          </div>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Show when="signed-in">
             <Link
              href="/dashboard"
              className="px-6 py-2.5 text-lg font-semibold bg-gray-500 text-white rounded-xl hover:bg-gray-700 transition-colors hidden md:block"
            >
              Dashboard
            </Link>
            
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-full h-full",
                    userButtonTrigger: "focus:shadow-none focus:ring-0"
                  }
                }}
              />
            </div>
          </Show>

          <Link href="/cart" className="relative p-2 text-gray-500 hover:text-teal-500 transition-colors">
            <ShoppingBag size={24} strokeWidth={2} />
            {cartItemCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          <Show when="signed-out">
            <div className="hidden items-center gap-4 md:flex">
              <SignInButton mode="modal">
                <button className="px-6 py-2.5 text-lg font-semibold bg-gray-500 text-white rounded-xl hover:bg-gray-700 transition-colors">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2.5 text-lg font-semibold bg-teal-500 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <button
            className="p-2 text-gray-500 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white p-4 md:hidden">
          <nav className="flex flex-col gap-2 font-semibold">
            <Link href="/products" className="p-2 rounded-xl hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Browse</Link>
            <Link href="/shops" className="p-2 rounded-xl hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Shops</Link>
            <Show when="signed-in">
              <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            </Show>
            <Show when="signed-out" >
              <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-gray-100">
                <SignInButton mode="modal">
                  <button className="w-full rounded-xl bg-gray-500 py-3 text-lg font-semibold text-white">Log in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full rounded-xl bg-teal-500 py-3 text-lg font-semibold text-white">Sign up</button>
                </SignUpButton>
              </div>
            </Show>
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
