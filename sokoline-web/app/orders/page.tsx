"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { fetchOrders } from "@/lib/api";
import { Order } from "@/lib/types";
import { Package, Clock, CheckCircle2, XCircle, ShoppingBag, MessageSquare } from "lucide-react";
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
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Purchases</h1>
        <p className="text-gray-500 font-medium max-w-sm text-lg">Sign in to track your student venture orders.</p>
        <Link href="/sign-in" className="bg-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-sm">Sign In</Link>
      </div>
    );
  }

  const handleReviewClick = (product: { id: number, name: string }) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20">
      <div className="mt-6 py-4 border-b border-gray-200">
         <h1 className="text-3xl font-bold text-gray-900">Purchase history</h1>
      </div>

      <div className="mt-6 px-8 py-12 bg-gray-100 rounded-xl">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-gray-300 text-center px-6">
             <div className="h-16 w-16 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
               <Package size={32} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
             <p className="text-gray-500 mb-8 max-w-xs font-medium">Ready to support campus founders?</p>
             <Link href="/products" className="bg-teal-500 text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-teal-700 shadow-sm">
               Browse Items
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-wrap justify-between items-center p-6 bg-gray-50 border-b border-gray-100 gap-4">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order #</p>
                        <p className="font-bold text-gray-900">#SKL-{order.id.toString().padStart(4, '0')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Placed on</p>
                        <p className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
                        <p className="font-black text-gray-900">${order.total_price}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                           {order.status === 'COMPLETED' ? (
                             <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-green-50 text-green-700 border border-green-100">Delivered</span>
                           ) : order.status === 'CANCELLED' ? (
                             <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-50 text-red-700 border border-red-100">Cancelled</span>
                           ) : (
                             <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-gray-100 text-gray-600 border border-gray-200">Processing</span>
                           )}
                        </div>
                      </div>
                   </div>
                   <button className="text-xs font-bold uppercase tracking-widest text-teal-500 hover:text-teal-700 transition-colors">
                      Invoice
                   </button>
                </div>
                
                <div className="p-6">
                   <div className="space-y-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-200 overflow-hidden shrink-0">
                                 <ShoppingBag size={24} />
                              </div>
                              <div>
                                 <p className="font-bold text-gray-900 text-lg group-hover:text-teal-500 transition-colors">{item.product_name}</p>
                                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <p className="font-black text-gray-900 text-lg">${item.price}</p>
                              {order.status === 'COMPLETED' && item.product && (
                                <button 
                                  onClick={() => handleReviewClick({ id: item.product!, name: item.product_name })}
                                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                                >
                                  <MessageSquare size={14} /> Review
                                </button>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
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
            onSuccess={() => {}}
          />
        )}
      </div>
    </main>
  );
}
