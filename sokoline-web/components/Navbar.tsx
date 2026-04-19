"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingBag, Search, Menu, Package, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart } = useCart();
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            sokoline
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            products
          </Link>
          <Link href="/shops" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            shops
          </Link>
          
          <Show when="signed-in">
            <Link href="/orders" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Package className="h-4 w-4" />
              orders
            </Link>
          </Show>
        </div>

        {/* ICONS & ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Search size={20} strokeWidth={1.5} />
            <span className="sr-only">Search</span>
          </button>

          <Link href="/cart" className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartItemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sokoline-accent text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Link>

          <Show when="signed-in">
            <Link 
              href="/dashboard" 
              className="hidden items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/80 md:flex"
            >
              <LayoutDashboard className="h-4 w-4" />
              dashboard
            </Link>
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border">
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
          
          <Show when="signed-out">
            <div className="hidden items-center gap-2 md:flex">
              <SignInButton mode="modal">
                <button className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-lg bg-sokoline-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sokoline-accent-hover hover:shadow-md">
                  join
                </button>
              </SignUpButton>
            </div>
          </Show>

          <button
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-6 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/products" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>products</Link>
            <Link href="/shops" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>shops</Link>
            <Show when="signed-in">
              <Link href="/orders" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>orders</Link>
              <Link href="/dashboard" className="text-sm font-semibold text-foreground" onClick={() => setMobileOpen(false)}>dashboard</Link>
            </Show>
            <Show when="signed-out">
              <div className="mt-4 flex flex-col gap-2">
                <SignInButton mode="modal">
                  <button className="w-full rounded-lg bg-accent py-2 text-sm font-medium text-accent-foreground">login</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full rounded-lg bg-sokoline-accent py-2 text-sm font-semibold text-white">join</button>
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
