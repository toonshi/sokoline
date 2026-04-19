"use client";

import Image from "next/image";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const title = "sokoline";

  return (
    <section className="relative w-full overflow-hidden bg-zinc-50 px-4 pb-12 pt-8 md:px-6 md:pt-10">
      
      {/* Subtle Grid Background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-8 lg:grid-cols-2 lg:gap-12">
        
        {/* Left Side: Clean Typography */}
        <div className="flex flex-col items-start gap-8">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Campus Commerce</p>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              <span className="flex overflow-hidden">
                {title.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={false}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.02,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span className="mt-2 block text-xl font-normal lg:text-2xl">
                <AnimatedText />
              </span>
            </h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col gap-6"
          >
            <p className="max-w-xl text-base leading-relaxed text-zinc-600">
              A trusted marketplace for student ventures to launch, sell, and scale with simple storefront tools and secure checkout.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/products" className="group inline-flex items-center gap-2 rounded-md bg-sokoline-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sokoline-accent-hover">
                Explore products <ArrowRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/sign-up" className="inline-flex items-center rounded-md border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                Open your shop
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 border-t border-zinc-200 pt-5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-zinc-900">15k+</span>
                <span className="text-zinc-500">students reached</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-zinc-900">240+</span>
                <span className="text-zinc-500">active ventures</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Clean Media */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative aspect-[4/5] w-full max-w-md justify-self-center lg:justify-self-end"
        >
          <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-zinc-200 bg-card shadow-sm transition-all hover:shadow-md">
            <Image
              src="/hero-image.jpg"
              alt="Sokoline Workspace"
              fill
              className="object-cover p-0 opacity-90 transition-opacity duration-700 group-hover:opacity-100"
              priority
            />
          </div>

          <div className="absolute -bottom-4 left-4 rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Verified shops</p>
            <p className="text-sm font-bold text-zinc-900">Secure student marketplace</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
