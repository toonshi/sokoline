"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Package, ArrowLeft, PlusCircle } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Shop", href: "/dashboard/my-shop", icon: Store },
    { name: "Inventory", href: "/dashboard/products", icon: Package },
  ];

  return (
    <div className="flex min-h-screen bg-muted text-foreground dark:bg-background">
      {/* Sidebar */}
      <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-border bg-background lg:sticky lg:top-0 lg:flex">
        <div className="px-8 pb-6 pt-8">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Sokoline
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Seller Dashboard
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-5 lg:hidden">
           <span className="text-base font-bold tracking-tight">Sokoline</span>
           <Link
             href="/dashboard/products"
             aria-label="Add product"
             className="rounded-lg bg-foreground p-2 text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sokoline-accent focus-visible:ring-offset-2"
           >
             <PlusCircle size={18} />
           </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
