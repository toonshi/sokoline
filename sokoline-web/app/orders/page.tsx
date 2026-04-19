"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { fetchOrders } from "@/lib/api";
import { Order } from "@/lib/types";
import { Package, Clock, CheckCircle2, XCircle, ShoppingBag, MessageSquare, ChevronRight } from "lucide-react";
import Link from 'next/link';
import ReviewModal from '@/components/ReviewModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<{ id: number, name: string } | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
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
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zinc-300"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-zinc-500 text-sm max-w-xs">Please sign in to view your order history.</p>
        <Link href="/sign-in" className="bg-zinc-900 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors hover:bg-zinc-800">Sign In</Link>
      </div>
    );
  }

  const handleReviewClick = (product: { id: number, name: string }) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  return (
    <main className="bg-zinc-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-zinc-900">Orders</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your orders and track your purchases.</p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-zinc-200 rounded-lg text-center px-6">
             <div className="h-12 w-12 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-300 mb-4">
               <Package size={24} />
             </div>
             <h2 className="text-lg font-medium text-zinc-900">No orders found</h2>
             <p className="text-zinc-500 text-sm mb-6 max-w-xs">You haven't placed any orders yet. Once you do, they'll appear here.</p>
             <Link href="/products" className="bg-zinc-900 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-zinc-800 transition-colors">
               Start shopping
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <div className="flex flex-wrap justify-between items-center p-6 bg-zinc-50/50 border-b border-zinc-200 gap-4">
                   <div className="flex flex-wrap gap-8 text-sm">
                      <div>
                        <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Order #</p>
                        <p className="font-medium text-zinc-900">SKL-{order.id.toString().padStart(5, '0')}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Date</p>
                        <p className="font-medium text-zinc-900">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Total</p>
                        <p className="font-medium text-zinc-900">${order.total_price}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Status</p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                           {order.status === 'COMPLETED' ? (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-100">
                               Delivered
                             </span>
                           ) : order.status === 'CANCELLED' ? (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-100">
                               Cancelled
                             </span>
                           ) : (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                               Processing
                             </span>
                           )}
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <button className="text-xs font-medium text-sokoline-accent hover:underline">
                         View Details
                      </button>
                      <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
                         Invoice
                      </button>
                   </div>
                </div>
                
                <div className="divide-y divide-zinc-100">
                   {order.items.map((item) => (
                     <div key={item.id} className="p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="h-14 w-14 rounded-md border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-300 overflow-hidden shrink-0">
                              <ShoppingBag size={20} />
                           </div>
                           <div>
                              <p className="font-medium text-zinc-900 text-sm group-hover:text-sokoline-accent transition-colors">{item.product_name}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">Quantity: {item.quantity}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <p className="font-medium text-zinc-900 text-sm">${item.price}</p>
                           {order.status === 'COMPLETED' && item.product && (
                             <button 
                               onClick={() => handleReviewClick({ id: item.product!, name: item.product_name })}
                               className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 hover:text-sokoline-accent border border-zinc-200 hover:border-sokoline-accent rounded-md px-3 py-1.5 transition-all bg-white shadow-sm"
                             >
                               <MessageSquare size={12} /> Leave a review
                             </button>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProduct && (
          <ReviewModal 
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            product={selectedProduct}
            onSuccess={() => {
              // Handle success (e.g., refresh data or show notification)
            }}
          />
        )}
      </div>
    </main>
  );
}
