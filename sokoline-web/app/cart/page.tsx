"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zinc-300"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <h1 className="text-2xl font-semibold">Shopping Bag</h1>
        <p className="text-zinc-500 text-sm max-w-xs">Please sign in to view and manage your cart.</p>
        <Link href="/sign-in" className="mt-4 bg-zinc-900 text-white px-8 py-2.5 rounded-md font-medium text-sm transition-colors hover:bg-zinc-800">
          Sign In
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <div className="h-16 w-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 border border-zinc-100">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Your bag is empty</h1>
          <p className="text-zinc-500 text-sm mt-1">Looks like you haven't added any student ventures yet.</p>
        </div>
        <Link href="/products" className="text-sokoline-accent text-sm font-medium hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Continue exploring
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-zinc-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-zinc-900 mb-12">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Item List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
               <div className="divide-y divide-zinc-100">
                 {cart.items.map((item) => (
                   <div key={item.id} className="p-6 flex gap-6 items-start group transition-colors hover:bg-zinc-50/50">
                     <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
                        <div className="flex items-center justify-center h-full text-zinc-200">
                          <ShoppingBag size={32} />
                        </div>
                     </div>
                     
                     <div className="flex-1 flex flex-col min-w-0">
                       <div className="flex justify-between items-start gap-4">
                         <div>
                           <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1">{item.product_name}</h3>
                           <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter font-medium">${item.unit_price} each</p>
                         </div>
                         <button 
                           onClick={() => removeItem(item.id)}
                           className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                           title="Remove item"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                       
                       <div className="flex justify-between items-center mt-auto pt-4">
                         <div className="flex items-center border border-zinc-200 rounded-md bg-white">
                           <button 
                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
                             className="px-3 py-1.5 text-zinc-400 hover:text-zinc-900 transition-colors border-r border-zinc-200"
                           >
                             <Minus size={14} />
                           </button>
                           <span className="text-xs font-semibold text-zinc-900 px-4 min-w-[40px] text-center">{item.quantity}</span>
                           <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
                             className="px-3 py-1.5 text-zinc-400 hover:text-zinc-900 transition-colors border-l border-zinc-200"
                           >
                             <Plus size={14} />
                           </button>
                         </div>
                         <span className="text-sm font-bold text-zinc-900">${item.total_price}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
            
            <Link href="/products" className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900">
               <ArrowLeft size={14} /> Back to shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-base font-semibold text-zinc-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-medium text-zinc-900">${cart.total_price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="text-[11px] font-bold uppercase text-green-700 tracking-tighter">Free on campus</span>
                </div>
                <div className="h-px bg-zinc-100 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-sm font-semibold text-zinc-900">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-zinc-900">${cart.total_price}</span>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">USD</p>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full bg-zinc-900 text-white py-3.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-sm active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              
              <div className="mt-6 flex flex-col gap-2">
                 <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
                    By proceeding to checkout you agree to our student commerce policies. All transactions are protected via M-Pesa.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
