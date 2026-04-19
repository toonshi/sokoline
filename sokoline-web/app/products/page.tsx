import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Filter, ArrowUpDown, SearchX } from "lucide-react";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mockProducts";

async function getProducts(search?: string, category?: string) {
  try {
    const envUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app").replace(/\/$/, "");
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    
    const res = await fetch(`${envUrl}/api/products/?${params.toString()}`, { next: { revalidate: 3600 } });
    if (!res.ok) return mockProducts;
    const data = await res.json();
    const products = data.results || data;
    
    if ((search || category) && products.length === 0) return [];
    
    return products.length > 0 ? products : mockProducts;
  } catch (error) {
    console.error("Error fetching products page data:", error);
    return mockProducts;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  const products = await getProducts(search, category);

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20">
      {/* Search/Filter Bar (Simplified) */}
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4 py-4 border-b border-gray-200">
         <h1 className="text-2xl font-bold text-gray-900">
            {search ? `Search results for "${search}"` : category ? `Category: ${category}` : "Browse all items"}
         </h1>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-500 text-white rounded-xl text-sm font-semibold hover:bg-gray-700">Filter</button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-xl text-sm font-semibold hover:bg-gray-700">Sort</button>
         </div>
      </div>

      <div className="mt-6 px-6 py-12 bg-gray-100 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <div key={product.id} className="group">
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-white">
                  {product.images?.[0] ? (
                    <Image 
                      src={product.images[0].image} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-200">
                      <ShoppingBag size={64} />
                    </div>
                  )}
                  {product.is_on_sale && (
                    <div className="absolute top-4 left-4 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wide">
                      Sale
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white rounded-b-xl">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-teal-500 transition-colors line-clamp-1">{product.name}</h2>
                  <p className="text-gray-500 mt-2 font-medium text-lg">Price: ${product.discount_price || product.price}</p>
                  <div className="flex items-center justify-between mt-4">
                     <div className="flex items-center gap-1">
                        <Star size={12} className="fill-orange-400 text-orange-400" />
                        <span className="text-xs font-semibold text-gray-600">{product.average_rating.toFixed(1)}</span>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.shop_name}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-gray-300 gap-4 mx-6">
            <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
               <SearchX size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">No items found</h2>
              <p className="text-gray-500 text-sm max-w-xs mt-1">
                We couldn't find any items matching your criteria. Try adjusting your search.
              </p>
            </div>
            <Link href="/products" className="text-teal-500 font-bold hover:underline">
              Clear all filters
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
