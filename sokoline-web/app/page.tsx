import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { mockProducts } from "@/lib/mockProducts";
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default async function Home() {
  const products = await getProducts({ limit: "4" });
  const featuredProducts = products.length > 0 ? products : mockProducts.slice(0, 4);

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 transition-colors duration-300">
      <HeroSection />
      
      {/* Featured Products */}
      <section className="w-full max-w-7xl px-4 py-14 md:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-zinc-200 pb-6 md:flex-row md:items-end">
             <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Curated selection</p>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
                   Featured products
                </h2>
             </div>
             <Link href="/products" className="group inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-50">
                View all <ArrowRight size={14} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" />
             </Link>
           </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
             {featuredProducts.map((product) => (
               <Link key={product.id} href={`/products/${product.slug}`} className="group block rounded-xl border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-zinc-200 bg-card">
                    {product.images?.[0] ? (
                      <Image 
                        src={product.images[0].image} 
                        alt={product.name} 
                        fill 
                        className="object-cover opacity-95 transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-300">
                        <ShoppingBag size={40} strokeWidth={1} />
                      </div>
                    )}
                    {product.is_on_sale && (
                      <div className="absolute left-3 top-3 rounded-md bg-sokoline-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 px-1 pt-3">
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{product.shop_name}</p>
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-sokoline-accent line-clamp-1">
                       {product.name}
                    </h3>
                    <p className="text-base font-bold text-zinc-900 tracking-tight">${product.discount_price || product.price}</p>
                  </div>
               </Link>
             ))}
          </div>

          {featuredProducts.length === 0 && (
             <div className="py-12 text-center text-zinc-400 font-medium italic text-sm">
                Awaiting next synchronization.
             </div>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-7xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-200 bg-white p-5 md:grid-cols-3 md:p-8">
          <div className="space-y-3 rounded-xl border border-zinc-200 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
               <BarChart3 size={18} strokeWidth={1.8} />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-900">Venture analytics</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Clear business metrics and inventory tracking in one dashboard.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-zinc-200 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
               <Zap size={18} strokeWidth={1.8} />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-900">Instant settlement</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Fast checkout with synced M-Pesa payment flows and smooth order handling.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-zinc-200 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
               <ShieldCheck size={18} strokeWidth={1.8} />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-900">Campus verified</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              A trusted platform protecting student founders and campus shoppers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-7xl px-4 py-6 md:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center md:p-12">
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            Start your venture today.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 md:text-base">
            Join Sokoline to open your campus storefront or discover products built by student founders.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-up" className="rounded-md bg-sokoline-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sokoline-accent-hover">
              Join the ecosystem
            </Link>
            <Link href="/shops" className="rounded-md border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
              Explore all shops
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-6 flex w-full max-w-7xl flex-col items-center justify-between gap-8 border-t border-zinc-200 px-4 py-10 md:flex-row md:px-6">
         <div className="space-y-2 text-center md:text-left">
            <p className="text-sm font-bold tracking-tight text-zinc-900">sokoline</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">© 2026 unified commerce infrastructure</p>
         </div>
         <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {['instagram', 'twitter', 'support'].map((link) => (
              <Link key={link} href="#" className="transition-colors hover:text-zinc-900">{link}</Link>
            ))}
         </div>
      </footer>
    </main>
  );
}
