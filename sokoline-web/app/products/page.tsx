import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Filter, ArrowUpDown, SearchX } from "lucide-react";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mockProducts";

async function getProducts(search?: string) {
  try {
    const envUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app").replace(/\/$/, "");
    const queryParams = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${envUrl}/api/products/${queryParams}`, { next: { revalidate: 3600 } });
    if (!res.ok) return mockProducts;
    const data = await res.json();
    const products = data.results || data;
    
    // If we're searching and get nothing, don't fall back to mockProducts unless we want to
    if (search && products.length === 0) return [];
    
    return products.length > 0 ? products : mockProducts;
  } catch (error) {
    console.error("Error fetching products page data:", error);
    return mockProducts;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const products = await getProducts(search);

  return (
    <main className="bg-background dark:bg-background min-h-screen transition-colors duration-300 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12 md:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight text-foreground dark:text-background mb-4 leading-none">
              {search ? (
                <>Results for <br /> <span className="text-sokoline-accent">{search}</span></>
              ) : (
                <>Explore <br /> <span className="text-sokoline-accent">Ventures</span></>
              )}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
              {search 
                ? `Showing ${products.length} items matching your search.` 
                : "Curated items from student entrepreneurs across the campus. Unique, reliable, and strictly built for you."
              }
            </p>
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-muted dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-xs font-semibold tracking-wider text-foreground dark:text-background hover:border-sokoline-accent transition-colors">
               <Filter size={14} /> Filter
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-muted dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-xs font-semibold tracking-wider text-foreground dark:text-background hover:border-sokoline-accent transition-colors">
               <ArrowUpDown size={14} /> Sort
             </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-muted dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-100 dark:group-hover:shadow-none">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0].image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300">
                    <ShoppingBag size={64} className="group-hover:scale-110 transition-transform" />
                  </div>
                )}
                
                {product.is_on_sale && (
                  <div className="absolute top-4 left-4 bg-sokoline-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl">
                    Sale
                  </div>
                )}

                <div className="absolute bottom-4 right-4 h-10 w-10 bg-background dark:bg-foreground rounded-2xl flex items-center justify-center text-foreground dark:text-background opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl">
                   <ShoppingBag size={18} />
                </div>
              </div>

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-background group-hover:text-sokoline-accent transition-colors line-clamp-1 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mt-0.5">{product.shop_name}</p>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-xl font-bold text-foreground dark:text-background">
                     ${product.discount_price || product.price}
                   </span>
                   {product.is_on_sale && (
                     <span className="text-[10px] text-zinc-400 line-through decoration-zinc-400/40 font-semibold uppercase">
                       ${product.price}
                     </span>
                   )}
                </div>
              </div>

              <div className="flex items-center gap-1 mt-4">
                 <Star size={10} className="fill-sokoline-accent text-sokoline-accent" />
                 <span className="text-[10px] font-bold text-sokoline-accent tracking-normal">{product.average_rating.toFixed(1)}</span>
                 <span className="text-[10px] font-medium text-zinc-300 tracking-normal ml-1">({product.review_count} Reviews)</span>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-40 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[48px] gap-6">
            <div className="h-20 w-20 rounded-3xl bg-muted dark:bg-zinc-900 flex items-center justify-center text-muted-foreground">
               <SearchX size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground dark:text-background uppercase tracking-tight">No products found</h2>
              <p className="text-zinc-500 font-medium max-w-sm mt-2">
                {search 
                  ? `We couldn't find anything matching "${search}". Try a different term!` 
                  : "The marketplace is currently resting. Check back soon!"
                }
              </p>
            </div>
            {search && (
              <Link href="/products" className="text-sokoline-accent font-bold uppercase tracking-widest text-xs underline underline-offset-8 decoration-2">
                Clear search
              </Link>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
