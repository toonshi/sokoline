"use client";

import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  AlertTriangle,
  CheckCircle2,
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
        <Loader2 className="animate-spin text-teal-500" size={40} />
      </div>
    );
  }

  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_price), 0);
  const activeOrdersCount = orders.filter(o => o.status === 'PENDING').length;

  const stats = [
    { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-600" },
    { name: "Active Orders", value: activeOrdersCount.toString(), icon: ShoppingBag, color: "text-orange-500" },
    { name: "Listed Items", value: shop?.products?.length?.toString() || "0", icon: TrendingUp, color: "text-teal-500" },
    { name: "Visitors", value: "0", icon: Users, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header (PRISTINE Style) */}
      <div className="mt-6 px-8 py-12 bg-gray-100 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-center md:text-left">
              <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-2">
                 Hi {user?.firstName || "Founder"}
              </h1>
              <p className="text-lg text-gray-500 font-medium max-w-xl">
                {shop ? `You are managing ${shop.name}. ` : "Register your student venture to start listing items."}
                Check your metrics and fulfillments below.
              </p>
           </div>
           <div className="flex gap-4">
              <Link
                href="/dashboard/products"
                className="px-6 py-3 bg-gray-500 text-white rounded-xl font-bold transition hover:bg-gray-700 shadow-sm"
              >
                Inventory
              </Link>
              <Link
                href="/dashboard/products/new"
                className="px-6 py-3 bg-teal-500 text-white rounded-xl font-bold transition hover:bg-teal-700 shadow-sm flex items-center gap-2"
              >
                <Plus size={18} />
                Add Item
              </Link>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="p-8 bg-gray-100 rounded-xl">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 bg-white rounded-xl shadow-sm ${stat.color}`}>
                  <stat.icon size={24} />
               </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.name}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders (PRISTINE Section) */}
      <div className="mt-6 px-8 py-12 bg-gray-100 rounded-xl">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Recent customer transactions</h2>

        {orders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">No sales data found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-gray-900">#SKL-{order.id.toString().padStart(4, '0')}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${
                          order.status === 'COMPLETED' ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-5 text-right font-black text-gray-900">${order.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
