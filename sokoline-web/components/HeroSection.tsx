"use client";

import Image from "next/image";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Show } from "@clerk/nextjs";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-zinc-50 px-4 pb-12 pt-8 md:px-6 md:pt-10">
      
      {/* Subtle Grid Background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm md:p-10 lg:grid-cols-2 lg:gap-16">
        
        {/* Left Side: Clean Typography */}
        <div className="flex flex-col items-start gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Institutional Infrastructure</p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              sokoline
              <span className="mt-2 block text-xl font-normal text-zinc-500 lg:text-2xl italic">
                <AnimatedText />
              </span>
            </h1>
          </div>
          
          <div className="flex flex-col gap-8">
            <p className="max-w-xl text-base leading-relaxed text-zinc-600">
              A reliable marketplace infrastructure built for student founders. Launch campus storefronts, manage inventory, and accept M-Pesa payments with verified security.
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/products" className="group inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800">
                Browse Marketplace <ArrowRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Show when="signed-in">
                <Link href="/dashboard" className="inline-flex items-center rounded-md border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                  Open your shop
                </Link>
              </Show>
              <Show when="signed-out">
                <Link href="/sign-up" className="inline-flex items-center rounded-md border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                  Open your shop
                </Link>
              </Show>
            </div>

            <div className="flex flex-wrap items-center gap-8 border-t border-zinc-100 pt-8">
              <div className="space-y-0.5">
                <p className="text-xl font-bold text-zinc-900 tracking-tight">15,000+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Monthly Users</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-bold text-zinc-900 tracking-tight">240+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Verified Shops</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Media */}
        <div className="relative aspect-[4/5] w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="group relative h-full w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm transition-all hover:shadow-md">
            <Image
              src="/hero-image.jpg"
              alt="Campus Marketplace"
              fill
              className="object-cover opacity-95"
              priority
            />
          </div>

          <div className="absolute -bottom-4 -left-4 rounded-md border border-zinc-200 bg-white px-4 py-3 shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Status</p>
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
               <p className="text-xs font-semibold text-zinc-900">Secure Payments Online</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
