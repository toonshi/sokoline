"use client";

import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { fetchMyShop, fetchOrders } from "@/lib/api";
import { Shop, Order } from "@/lib/types";

export default function DashboardOverview() {
  const { user } = useUser();
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isSignedIn) return;
      
      try {
        const token = await getToken();
        if (token) {
          const [shopData, orderData] = await Promise.all([
            fetchMyShop(token),
            fetchOrders(token)
          ]);
          setShop(shopData);
          setOrders(orderData);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authLoaded) {
      loadDashboardData();
    }
  }, [authLoaded, isSignedIn]);

  if (!authLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-sokoline-accent" size={40} />
      </div>
    );
  }

  // Calculate real stats from orders
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_price), 0);
  const activeOrdersCount = orders.filter(o => o.status === 'PENDING').length;

  const stats = [
    { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, change: "Lifetime sales", status: "positive" },
    { name: "Active Orders", value: activeOrdersCount.toString(), icon: ShoppingBag, change: "Awaiting fulfillment", status: "warning" },
    { name: "Inventory Items", value: shop?.products?.length?.toString() || "0", icon: TrendingUp, change: "Listed products", status: "positive" },
    { name: "Store Visitors", value: "0", icon: Users, change: "Analytics coming soon", status: "neutral" },
  ];

  const priorities = [
    { label: "Ship pending orders", note: `${activeOrdersCount} orders need attention`, icon: AlertTriangle, level: activeOrdersCount > 0 ? "high" : "low" },
    { label: "Update inventory", note: "Keep your stock levels fresh", icon: Clock3, level: "medium" },
    { label: "Complete trust verification", note: "Gain the safety certified badge", icon: CheckCircle2, level: "low" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Vendor Overview</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-foreground">
             Hi {user?.firstName || "Entrepreneur"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground font-medium">
            {shop ? `Managing ${shop.name}. ` : "Set up your shop to start selling to students."}
            Monitor your sales and inventory below.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="inline-flex items-center rounded-2xl border border-border px-6 py-3 text-xs font-bold text-muted-foreground transition hover:bg-muted"
          >
            Inventory
          </Link>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center rounded-2xl bg-foreground px-6 py-3 text-xs font-bold text-background transition hover:bg-sokoline-accent shadow-xl active:scale-95"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.name}
            className="rounded-[32px] border border-border bg-card p-8 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-2xl bg-sokoline-accent/10 p-3 text-sokoline-accent">
                <stat.icon size={20} />
              </div>
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.name}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
            <p className="mt-2 text-[10px] font-semibold text-muted-foreground uppercase">{stat.change}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
        {/* Empty Sales Chart Placeholder */}
        <section className="rounded-[40px] border border-border bg-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Sales performance</h2>
              <p className="text-sm text-muted-foreground font-medium mt-1">Real-time revenue tracking</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-[32px] text-muted-foreground italic text-sm">
             Analytics will populate after your first sale.
          </div>
        </section>

        <section className="rounded-[40px] border border-border bg-card p-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Next Steps</h2>
          <ul className="mt-6 space-y-4">
            {priorities.map((task) => (
              <li key={task.label} className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 rounded-xl p-2 ${
                      task.level === "high"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <task.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight text-foreground">{task.label}</p>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">{task.note}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Orders Table */}
      <section className="rounded-[40px] border border-border bg-card p-8 pb-4">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Recent Transactions</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">Track your support from other students</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[32px] text-muted-foreground italic text-sm mb-4">
             Your transaction history is empty.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  <th className="pb-6 pr-4">Order ID</th>
                  <th className="pb-6 pr-4">Status</th>
                  <th className="pb-6 pr-4">Total</th>
                  <th className="pb-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="group">
                    <td className="py-6 pr-4 font-bold text-sm text-foreground">#SKL-{order.id.toString().padStart(4, '0')}</td>
                    <td className="py-6 pr-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter ${
                        order.status === 'COMPLETED' ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 pr-4 font-bold text-sm text-foreground">${order.total_price}</td>
                    <td className="py-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
