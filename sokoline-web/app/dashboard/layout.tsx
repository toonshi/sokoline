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
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar (PRISTINE Style) */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:sticky lg:top-0 lg:flex">
        <div className="px-8 pb-6 pt-10">
          <Link href="/" className="text-3xl font-black tracking-tight text-gray-900">
            metric
          </Link>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-teal-500">
            Founder Admin
          </p>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 mt-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-gray-100 text-teal-600 shadow-sm"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-6 border-t border-gray-100">
          <Link 
            href="/" 
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:hidden">
           <span className="text-xl font-black tracking-tight">metric</span>
           <Link href="/dashboard" className="text-gray-400 hover:text-gray-900">
              <LayoutDashboard size={24} />
           </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
