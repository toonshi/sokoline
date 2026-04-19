"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Package, ArrowLeft, ShoppingCart } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Shop", href: "/dashboard/my-shop", icon: Store },
    { name: "Inventory", href: "/dashboard/products", icon: Package },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 text-foreground">
      {/* Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:sticky lg:top-0 lg:flex">
        <div className="px-6 pb-6 pt-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
            sokoline
          </Link>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Seller Admin
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-zinc-100">
          <Link 
            href="/" 
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
          >
            <ArrowLeft size={16} />
            Back to store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-5 lg:hidden">
           <span className="text-sm font-bold tracking-tight">sokoline admin</span>
           <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-900">
              <LayoutDashboard size={20} />
           </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-zinc-50/50">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
