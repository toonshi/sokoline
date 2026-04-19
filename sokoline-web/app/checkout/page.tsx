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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Authentication Required</h1>
        <p className="text-muted-foreground text-sm">Please sign in to complete your purchase.</p>
        <Link href="/sign-in" className="bg-sokoline-accent text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors hover:bg-sokoline-accent/90">Sign In</Link>
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
        <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Order Confirmed</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          Your payment was successful. We've sent a confirmation to your email. Redirecting you to your orders...
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-xl font-medium">Your bag is empty</h1>
        <Link href="/products" className="text-sokoline-accent text-sm font-medium hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <main className="bg-zinc-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
        <Link href="/cart" className="text-sm text-muted-foreground flex items-center gap-2 mb-8 hover:text-foreground transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to bag
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Payment Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Payment Method</h2>
              
              {pollingStatus === "pending" ? (
                <div className="bg-zinc-50 rounded-md p-10 border border-zinc-100 flex flex-col items-center text-center gap-4">
                  <Loader2 size={32} className="animate-spin text-sokoline-accent" />
                  <div>
                    <h3 className="text-base font-medium text-foreground">Waiting for confirmation</h3>
                    <p className="text-xs text-muted-foreground mt-1">Please enter your M-Pesa PIN on your phone to complete the transaction.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-medium text-zinc-600">M-Pesa Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                        <Phone size={18} />
                      </div>
                      <input 
                        id="phone"
                        type="tel"
                        placeholder="2547XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isProcessing}
                        className="w-full bg-white border border-zinc-300 rounded-md py-3 pl-11 pr-4 text-sm focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent outline-none transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-400 italic">Enter your number starting with 254</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-md p-4 flex items-center gap-3 text-xs font-medium">
                      <XCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-sokoline-accent text-white py-3.5 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:bg-sokoline-accent/90 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Payment
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-zinc-400">
               <ShieldCheck size={16} />
               <span className="text-[11px] font-medium uppercase tracking-tight">Secure Transaction via Safaricom Daraja</span>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-100/50 border border-zinc-200 rounded-lg p-8">
              <h2 className="text-base font-semibold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-800">{item.product_name}</span>
                      <span className="text-xs text-zinc-500">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-medium text-zinc-800">${item.total_price}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-200 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>${cart.total_price}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span className="text-[11px] font-medium uppercase text-zinc-400 italic">Calculated by vendor</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-zinc-200">
                  <span className="font-semibold text-zinc-900">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-zinc-900">${cart.total_price}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">USD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
