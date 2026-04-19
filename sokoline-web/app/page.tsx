import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { mockProducts } from "@/lib/mockProducts";
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, BarChart3, Star } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  const products = await getProducts({ limit: "4" });
  const featuredProducts = products.length > 0 ? products : mockProducts.slice(0, 4);

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50">
      <HeroSection />
      
      {/* Featured Products */}
      <section className="w-full max-w-7xl px-4 py-20">
        <div className="bg-white border border-zinc-200 rounded-lg p-6 md:p-10 shadow-sm">
          <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
             <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Curated ventures</p>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
                   Trending Products
                </h2>
             </div>
             <Link href="/products" className="group flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800">
                Browse Marketplace <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
             </Link>
           </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
             {featuredProducts.map((product) => (
               <Link key={product.id} href={`/products/${product.slug}`} className="group block space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 transition-all group-hover:border-zinc-200">
                    {product.images?.[0] ? (
                      <Image 
                        src={product.images[0].image} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-200">
                        <ShoppingBag size={48} />
                      </div>
                    )}
                    {product.is_on_sale && (
                      <div className="absolute left-2 top-2 rounded bg-sokoline-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-white shadow-sm">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                       <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-sokoline-accent transition-colors line-clamp-1">
                          {product.name}
                       </h3>
                       <span className="text-sm font-bold text-zinc-900">${product.discount_price || product.price}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">{product.shop_name}</p>
                    <div className="flex items-center gap-1">
                       <Star size={12} className="fill-orange-400 text-orange-400" />
                       <span className="text-[11px] font-medium text-zinc-600">{(product.average_rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
               </Link>
             ))}
          </div>

          {featuredProducts.length === 0 && (
             <div className="py-20 text-center text-zinc-400 font-medium text-sm">
                Marketplace update in progress.
             </div>
          )}
        </div>
      </section>

      {/* Institutional Value Propositions */}
      <section className="w-full max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-3">
            <div className="h-10 w-10 rounded bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600">
               <BarChart3 size={20} />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-900">Venture Analytics</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Complete inventory control and revenue tracking for student-led businesses.
            </p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-3">
            <div className="h-10 w-10 rounded bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600">
               <Zap size={20} />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-900">M-Pesa Integration</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Native Daraja STK Push for instant, secure mobile payments across campus.
            </p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-3">
            <div className="h-10 w-10 rounded bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600">
               <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-900">Campus Verification</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Standardized security layers protecting every student founder and buyer.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-7xl px-4 py-20">
        <div className="bg-zinc-900 rounded-lg p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white max-w-2xl mx-auto">
              Ready to launch your campus venture?
            </h2>
            <p className="max-w-lg mx-auto text-zinc-400 text-sm md:text-base">
              Join the unified campus commerce infrastructure. Open your shop in minutes and reach thousands of students.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link 
                href={userId ? "/dashboard" : "/sign-up"} 
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
              >
                Open your shop
              </Link>
              <Link href="/shops" className="rounded-md border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800">
                View All Vendors
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full max-w-7xl px-4 py-12 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-8">
         <div className="text-center md:text-left space-y-1">
            <p className="text-lg font-bold text-zinc-900">sokoline</p>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">© 2026 unified commerce infrastructure</p>
         </div>
         <div className="flex items-center gap-8">
            {['Status', 'Legal', 'Privacy', 'Campus Support'].map((link) => (
              <Link key={link} href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">{link}</Link>
            ))}
         </div>
      </footer>
    </main>
  );
}
