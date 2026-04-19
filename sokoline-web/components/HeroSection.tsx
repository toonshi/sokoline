"use client";

import Image from "next/image";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Show } from "@clerk/nextjs";

export default function HeroSection() {
  return (
    <section className="mt-6 px-6 py-12 bg-gray-100 rounded-xl">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900">
          metric
        </h1>
        
        <p className="text-2xl text-gray-600 italic">
          <AnimatedText />
        </p>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Support student entrepreneurs. Every item here is owned and operated by students within the campus ecosystem.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Link href="/products" className="px-8 py-4 text-lg font-semibold bg-teal-500 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
            Browse Items
          </Link>
          <Show when="signed-in">
            <Link href="/dashboard" className="px-8 py-4 text-lg font-semibold bg-gray-500 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-sm">
              Open your shop
            </Link>
          </Show>
          <Show when="signed-out">
            <Link href="/sign-up" className="px-8 py-4 text-lg font-semibold bg-gray-500 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-sm">
              Open your shop
            </Link>
          </Show>
        </div>
      </div>
    </section>
  );
}
