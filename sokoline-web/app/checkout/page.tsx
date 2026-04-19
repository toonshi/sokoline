"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { checkoutCart, getOrderPaymentStatus } from "@/lib/api";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Phone, XCircle } from "lucide-react";
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
              }, 4000);
            } else if (statusData.payment_status === "FAILED") {
              setPollingStatus("failed");
              setIsFailed(true);
              setIsProcessing(false);
              setError("Payment failed. Please try again or check your M-Pesa balance.");
              clearInterval(interval);
            }
          }
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId, pollingStatus, getToken, refreshCart, router]);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Authentication Required</h1>
        <Link href="/sign-in" className="bg-sokoline-accent text-white px-8 py-3 rounded-full font-bold">Sign In</Link>
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
      console.error("Checkout failed:", err);
      setError(err.message || "Checkout failed. Please check your phone number and try again.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-8 animate-bounce">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground max-w-md font-medium text-lg">
          Your order has been placed and paid for. Redirecting you to your orders...
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 className="text-2xl font-bold">Nothing to checkout</h1>
        <Link href="/products" className="text-sokoline-accent font-bold underline">Go find something cool</Link>
      </div>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <Link href="/cart" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-12 hover:text-sokoline-accent transition-colors">
          <ArrowLeft size={14} /> Back to bag
        </Link>

        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-12">Checkout</h1>
        
        <div className="bg-card rounded-[32px] border border-border p-10">
          <h2 className="text-xl font-bold text-foreground mb-8 pb-4 border-b border-border">Order Summary</h2>
          
          <div className="space-y-6 mb-10">
            {cart.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">{item.product_name}</span>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                </div>
                <span className="font-bold text-foreground">${item.total_price}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-10 pt-6 border-t border-border">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Subtotal</span>
              <span className="text-foreground">${cart.total_price}</span>
            </div>
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Shipping</span>
              <span className="text-sokoline-accent font-bold text-xs uppercase tracking-widest">Calculated at Vendor</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Total to pay</span>
              <span className="text-3xl font-bold text-foreground leading-none">${cart.total_price}</span>
            </div>
          </div>

          {pollingStatus === "pending" ? (
            <div className="bg-sokoline-accent/5 rounded-2xl p-8 border border-sokoline-accent/20 flex flex-col items-center text-center gap-4">
              <Loader2 size={48} className="animate-spin text-sokoline-accent" />
              <div>
                <h3 className="text-lg font-bold text-foreground">Waiting for Payment</h3>
                <p className="text-sm text-muted-foreground">Please check your phone for the M-Pesa STK Push and enter your PIN.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">M-Pesa Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input 
                    id="phone"
                    type="tel"
                    placeholder="2547XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isProcessing}
                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-sokoline-accent outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Enter number in format 254XXXXXXXXX</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 flex items-center gap-3 text-sm font-bold">
                  <XCircle size={18} />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-sokoline-accent text-white py-6 rounded-[24px] font-bold tracking-wide flex items-center justify-center gap-3 hover:bg-sokoline-accent-hover transition-all shadow-2xl shadow-sokoline-accent/20 dark:shadow-none disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay with M-Pesa <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}
          
          <p className="mt-8 text-[9px] text-muted-foreground uppercase tracking-[0.2em] text-center font-bold">
            Secure student-to-student transaction via Sokoline
          </p>
        </div>
      </div>
    </main>
  );
}
