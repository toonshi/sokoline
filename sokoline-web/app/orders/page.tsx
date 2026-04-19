"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { fetchOrders } from "@/lib/api";
import { Order } from "@/lib/types";
import { Package, Clock, CheckCircle2, XCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await fetchOrders(token);
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      getOrders();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sokoline-accent"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Purchase History</h1>
        <p className="text-zinc-500 font-medium max-w-sm">Sign in to track your student venture purchases.</p>
        <Link href="/sign-in" className="bg-sokoline-accent text-white px-8 py-3 rounded-full font-bold">Sign In</Link>
      </div>
    );
  }

  return (
    <main className="bg-background dark:bg-background min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground dark:text-background uppercase">Your Orders</h1>
            <p className="text-zinc-500 font-medium mt-2">Tracking your support for campus entrepreneurs.</p>
          </div>
          <div className="hidden md:block bg-[#F5F3FF] dark:bg-[#1E1B4B] px-6 py-3 rounded-2xl border border-sokoline-accent/10">
            <span className="text-xs font-black uppercase tracking-widest text-sokoline-accent">{orders.length} total orders</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[48px] text-center px-6">
             <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center text-zinc-300 mb-8">
               <Package size={40} />
             </div>
             <h2 className="text-3xl font-bold text-foreground dark:text-background uppercase mb-2">No orders yet</h2>
             <p className="text-zinc-500 mb-8 max-w-xs font-medium">Time to explore the marketplace and support some student ventures.</p>
             <Link href="/products" className="bg-foreground dark:bg-background text-white dark:text-foreground px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl transition-transform active:scale-95">
               Browse Products
             </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-muted dark:bg-zinc-900/40 rounded-[32px] border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-background dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800 gap-6">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Order ID</span>
                        <span className="font-bold text-foreground dark:text-background">#SKL-{order.id.toString().padStart(5, '0')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Date</span>
                        <span className="font-bold text-foreground dark:text-background">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Total</span>
                        <span className="font-black text-foreground dark:text-background">${order.total_price}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Status</span>
                        <div className="flex items-center gap-1.5">
                           {order.status === 'COMPLETED' ? (
                             <>
                               <CheckCircle2 size={14} className="text-green-500" />
                               <span className="text-xs font-black uppercase tracking-tighter text-green-500">Delivered</span>
                             </>
                           ) : order.status === 'CANCELLED' ? (
                             <>
                               <XCircle size={14} className="text-red-500" />
                               <span className="text-xs font-black uppercase tracking-tighter text-red-500">Cancelled</span>
                             </>
                           ) : (
                             <>
                               <Clock size={14} className="text-sokoline-accent" />
                               <span className="text-xs font-black uppercase tracking-tighter text-sokoline-accent">Processing</span>
                             </>
                           )}
                        </div>
                      </div>
                   </div>
                   <button className="text-xs font-black uppercase tracking-widest text-sokoline-accent hover:opacity-70 transition-opacity border-b border-transparent hover:border-sokoline-accent">
                      Download Invoice
                   </button>
                </div>
                
                <div className="p-8">
                   <div className="space-y-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                                 <ShoppingBag size={20} />
                              </div>
                              <div>
                                 <span className="font-bold text-foreground dark:text-background uppercase text-sm block">{item.product_name}</span>
                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                              </div>
                           </div>
                           <span className="font-bold text-foreground dark:text-background">${item.price}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
