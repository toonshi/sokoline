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
    <main className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-zinc-100 pb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-2">
              {search ? (
                <>Search results for "{search}"</>
              ) : (
                <>All Products</>
              )}
            </h1>
            <p className="text-zinc-500 text-sm">
              {search 
                ? `Found ${products.length} items matching your criteria.` 
                : "Browse our curated selection of student-led ventures and campus essentials."
              }
            </p>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
               <Filter size={14} /> Filter
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
               <ArrowUpDown size={14} /> Sort
             </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 border border-zinc-100 mb-4 transition-all group-hover:border-zinc-200">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0].image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300">
                    <ShoppingBag size={48} />
                  </div>
                )}
                
                {product.is_on_sale && (
                  <div className="absolute top-2 left-2 bg-sokoline-accent text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">
                    Sale
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-zinc-900 group-hover:text-sokoline-accent transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">{product.shop_name}</p>
                <div className="flex items-center gap-2 pt-1">
                   <span className="text-sm font-semibold text-zinc-900">
                     ${product.discount_price || product.price}
                   </span>
                   {product.is_on_sale && (
                     <span className="text-xs text-zinc-400 line-through">
                       ${product.price}
                     </span>
                   )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                   <Star size={12} className="fill-orange-400 text-orange-400" />
                   <span className="text-[11px] font-medium text-zinc-600">{product.average_rating.toFixed(1)}</span>
                   <span className="text-[11px] text-zinc-400 ml-1">({product.review_count})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-zinc-50 rounded-lg border border-dashed border-zinc-200 gap-4">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-zinc-400 border border-zinc-100">
               <SearchX size={24} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">No results found</h2>
              <p className="text-zinc-500 text-sm max-w-xs mt-1">
                {search 
                  ? `We couldn't find any products matching "${search}". Try adjusting your filters.` 
                  : "The marketplace is currently empty. Check back later!"
                }
              </p>
            </div>
            {search && (
              <Link href="/products" className="text-sokoline-accent text-sm font-medium hover:underline">
                Clear all filters
              </Link>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
