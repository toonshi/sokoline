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
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        <p className="text-gray-500 text-sm max-w-xs">Please sign in to manage your student venture items.</p>
        <Link href="/sign-in" className="mt-4 bg-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-colors hover:bg-gray-700">
          Log In
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 border border-gray-200">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-500 font-medium mt-1">Ready to support some campus innovators?</p>
        </div>
        <Link href="/products" className="px-8 py-4 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center gap-2">
          <ArrowLeft size={20} /> Browse Items
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20">
      <div className="mt-6 py-4 border-b border-gray-200">
         <h1 className="text-3xl font-bold text-gray-900">Your shopping cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
        {/* Item List (PRISTINE bg-gray-100 container) */}
        <div className="lg:col-span-3">
          <div className="bg-gray-100 rounded-xl p-6 space-y-4">
             {cart.items.map((item) => (
               <div key={item.id} className="flex gap-6 items-start p-4 bg-white rounded-xl shadow-sm transition-all hover:border-gray-200 border border-transparent">
                 <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-center h-full text-gray-200">
                      <ShoppingBag size={24} />
                    </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col min-w-0">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.product_name}</h3>
                       <p className="text-xs text-gray-400 mt-0.5 font-bold uppercase tracking-widest">${item.unit_price} unit</p>
                     </div>
                     <button 
                       onClick={() => removeItem(item.id)}
                       className="text-gray-300 hover:text-red-500 transition-colors p-1"
                       title="Remove"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                   
                   <div className="flex justify-between items-center mt-4">
                     <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                       >
                         <Minus size={14} />
                       </button>
                       <span className="text-xs font-bold text-gray-900 px-3 min-w-[32px] text-center">{item.quantity}</span>
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                       >
                         <Plus size={14} />
                       </button>
                     </div>
                     <span className="text-lg font-black text-gray-900">${item.total_price}</span>
                   </div>
                 </div>
               </div>
             ))}
          </div>
          
          <Link href="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
             <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {/* Summary (PRISTINE bg-gray-100 container) */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-xl p-8 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Summary</h2>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-lg font-medium text-gray-600">
                <span>Subtotal</span>
                <span>${cart.total_price}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-gray-600">
                <span>Shipping</span>
                <span className="text-teal-600 font-bold uppercase text-xs tracking-widest pt-1">Free</span>
              </div>
              <div className="h-px bg-gray-200 my-6" />
              <div className="flex justify-between items-end">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-gray-900 leading-none">${cart.total_price}</span>
                </div>
              </div>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full bg-teal-500 text-white py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-md active:scale-[0.98]"
            >
              Checkout <ArrowRight size={24} />
            </Link>
            
            <p className="mt-8 text-[10px] font-bold text-gray-400 text-center uppercase tracking-[0.2em] leading-relaxed">
              Student-to-Student Transaction <br /> Powered by metric Infrastructure
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
