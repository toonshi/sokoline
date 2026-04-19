"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchShopOrders } from "@/lib/api";
import { Order } from "@/lib/types";
import { Package, Clock, CheckCircle2, XCircle, ShoppingBag, ArrowUpRight, DollarSign } from "lucide-react";
import Link from "next/link";

export default function ShopOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await fetchShopOrders(token);
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch shop orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      getOrders();
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zinc-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Sales & Orders</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track incoming orders and verify student payments.
          </p>
        </div>
        <div className="bg-white border border-zinc-200 px-4 py-2 rounded-md shadow-sm">
           <div className="flex items-center gap-2">
             <DollarSign size={16} className="text-green-600" />
             <span className="text-sm font-semibold text-zinc-900">
               ${orders.reduce((acc, o) => acc + (o.payment_status === 'SUCCESS' ? parseFloat(o.total_price) : 0), 0).toFixed(2)} 
               <span className="text-zinc-400 font-normal ml-1">Total Revenue</span>
             </span>
           </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="h-12 w-12 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-100">
               <Package size={24} />
             </div>
             <h2 className="text-base font-semibold text-zinc-900">No sales yet</h2>
             <p className="text-zinc-500 text-sm max-w-xs mt-1">Incoming orders from other students will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-tighter">Order</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-tighter">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-tighter">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-tighter">Payment</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-tighter">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600 uppercase tracking-tighter text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-zinc-900">#SKL-{order.id.toString().padStart(5, '0')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm text-zinc-900 font-medium">Student #{order.user}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                         order.payment_status === 'SUCCESS' 
                           ? "bg-green-50 text-green-700 border-green-100" 
                           : order.payment_status === 'FAILED'
                           ? "bg-red-50 text-red-700 border-red-100"
                           : "bg-orange-50 text-orange-700 border-orange-100"
                       }`}>
                         {order.payment_status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                         order.status === 'COMPLETED' 
                           ? "bg-blue-50 text-blue-700 border-blue-100" 
                           : "bg-zinc-100 text-zinc-600 border-zinc-200"
                       }`}>
                         {order.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-zinc-900">${order.total_price}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-zinc-100 border border-zinc-200 rounded-md p-4 flex items-start gap-3">
         <Clock size={16} className="text-zinc-500 mt-0.5" />
         <div className="text-xs text-zinc-600 leading-normal">
            <p className="font-semibold text-zinc-900 mb-1">Verify Payments Carefully</p>
            Only fulfill and deliver items when the **Payment Status** is marked as <span className="text-green-700 font-bold uppercase tracking-tighter">Success</span>. This confirms the M-Pesa transaction has been verified by the system.
         </div>
      </div>
    </div>
  );
}
