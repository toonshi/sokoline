"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { checkoutCart, getOrderPaymentStatus } from "@/lib/api";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Phone, XCircle, ShieldCheck } from "lucide-react";
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingStatus, setPollingStatus] = useState<string>("waiting"); // waiting, pending, success, failed

  // Handle M-Pesa Polling
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (orderId && pollingStatus === "pending") {
      interval = setInterval(async () => {
        const token = await getToken();
        if (token) {
          const statusData = await getOrderPaymentStatus(token, orderId);
          if (statusData) {
            if (statusData.payment_status === "SUCCESS") {
              setPollingStatus("success");
              setIsSuccess(true);
              await refreshCart();
              clearInterval(interval);
              setTimeout(() => {
                router.push("/orders");
              }, 3000);
            } else if (statusData.payment_status === "FAILED") {
              setPollingStatus("failed");
              setIsFailed(true);
              setIsProcessing(false);
              setError("Payment failed. Please try again or check your M-Pesa balance.");
              clearInterval(interval);
            }
          }
        }
      }, 3000); 
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId, pollingStatus, getToken, refreshCart, router]);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Sign in to checkout</h1>
        <Link href="/sign-in" className="bg-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors">Log In</Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError("Please enter your M-Pesa phone number");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setIsFailed(false);
    
    try {
      const token = await getToken();
      if (token) {
        const order = await checkoutCart(token, phoneNumber);
        if (order) {
          setOrderId(order.id);
          setPollingStatus("pending");
        }
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed. Please verify your phone number.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="h-20 w-20 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-8 border border-green-100 shadow-sm">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Payment confirmed</h1>
        <p className="text-gray-500 max-w-sm text-lg font-medium">
          Your order has been placed successfully. Support more ventures while we prepare your delivery.
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-xl font-bold text-gray-900">Your bag is empty</h1>
        <Link href="/products" className="text-teal-500 font-bold hover:underline">Go shopping</Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20">
      <div className="mt-6 py-4 border-b border-gray-200">
          <Link href="/cart" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 uppercase tracking-widest group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to bag
          </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
        {/* Payment Column */}
        <div className="lg:col-span-3">
          <div className="bg-gray-100 rounded-xl p-8 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Secure Payment</h2>
            
            {pollingStatus === "pending" ? (
              <div className="bg-white rounded-xl p-12 border border-gray-200 flex flex-col items-center text-center gap-6 shadow-sm">
                <Loader2 size={48} className="animate-spin text-teal-500" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Awaiting your PIN</h3>
                  <p className="text-gray-500 font-medium mt-2">Enter your M-Pesa PIN on your phone to complete the transaction.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="phone" className="text-sm font-bold text-gray-500 uppercase tracking-widest">M-Pesa Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={20} />
                    </div>
                    <input 
                      id="phone"
                      type="tel"
                      placeholder="2547XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isProcessing}
                      className="w-full bg-white border-2 border-transparent focus:border-teal-500 rounded-xl py-4 pl-14 pr-6 text-lg font-bold text-gray-900 outline-none transition-all shadow-sm"
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-400 italic">Please use the format 254700000000</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-6 flex items-center gap-3 text-sm font-bold">
                    <XCircle size={20} />
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-teal-500 text-white py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-teal-700 transition-all shadow-md disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Checkout
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-2 text-gray-400 pt-4">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Daraja Infrastructure</span>
            </div>
          </div>
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-xl p-8 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Your order</h2>
            
            <div className="space-y-4 mb-8">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{item.product_name}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-0.5">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-black text-gray-900">${item.total_price}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-lg font-medium text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${cart.total_price}</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-xl font-bold text-gray-900">Total Due</span>
                <div className="text-right">
                  <p className="text-4xl font-black text-gray-900 leading-none">${cart.total_price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
