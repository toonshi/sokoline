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
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* LEFT: LOGO & NAV */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              sokoline
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/products" className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              Products
            </Link>
            <Link href="/shops" className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              Shops
            </Link>
          </div>
        </div>

        {/* CENTER: SEARCH (Shopify-style integrated) */}
        <div className="hidden max-w-md flex-1 px-8 md:block">
           <form onSubmit={handleSearch} className="relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Search size={14} />
             </div>
             <input 
               type="text"
               placeholder="Search..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-zinc-100 border border-transparent rounded-md py-1.5 pl-9 pr-4 text-xs focus:bg-white focus:border-zinc-300 outline-none transition-all"
             />
           </form>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Show when="signed-in">
            <Link 
              href="/dashboard" 
              className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors md:flex"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-200">
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

          <Link href="/cart" className="relative p-2 text-zinc-500 hover:text-zinc-900 transition-colors">
            <ShoppingBag size={18} strokeWidth={2} />
            {cartItemCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-sokoline-accent text-[9px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          <Show when="signed-out">
            <div className="hidden items-center gap-2 md:flex">
              <SignInButton mode="modal">
                <button className="text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-1.5">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800 transition-all shadow-sm">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <button
            className="p-2 text-zinc-500 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white p-4 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Search size={14} />
             </div>
             <input 
               type="text"
               placeholder="Search..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-zinc-100 rounded-md py-2 pl-9 pr-4 text-xs outline-none"
             />
          </form>
          <nav className="flex flex-col gap-1">
            <Link href="/products" className="text-xs font-medium text-zinc-600 p-2 rounded-md hover:bg-zinc-50" onClick={() => setMobileOpen(false)}>Products</Link>
            <Link href="/shops" className="text-xs font-medium text-zinc-600 p-2 rounded-md hover:bg-zinc-50" onClick={() => setMobileOpen(false)}>Shops</Link>
            <Show when="signed-in">
              <Link href="/orders" className="text-xs font-medium text-zinc-600 p-2 rounded-md hover:bg-zinc-50" onClick={() => setMobileOpen(false)}>Orders</Link>
              <Link href="/dashboard" className="text-xs font-semibold text-zinc-900 p-2 rounded-md hover:bg-zinc-50" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            </Show>
            <Show when="signed-out" >
              <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-zinc-100">
                <SignInButton mode="modal">
                  <button className="w-full rounded-md border border-zinc-200 py-2 text-[11px] font-semibold text-zinc-700">Log in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full rounded-md bg-zinc-900 py-2 text-[11px] font-semibold text-white">Sign up</button>
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
