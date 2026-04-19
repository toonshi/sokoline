import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShieldCheck, MapPin, Star } from "lucide-react";

async function getShopData(slug: string) {
  try {
    const envUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app").replace(/\/$/, "");
    const res = await fetch(`${envUrl}/api/shops/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return null;
  }
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shop = await getShopData(slug);

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-zinc-50">
        <h1 className="text-xl font-semibold text-zinc-900">Shop not found</h1>
        <Link href="/shops" className="text-sokoline-accent text-sm font-medium hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to shops
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-zinc-50 min-h-screen">
      {/* Shop Header */}
      <section className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <Link href="/shops" className="text-xs font-medium text-zinc-500 flex items-center gap-2 mb-10 hover:text-zinc-900 transition-colors">
            <ArrowLeft size={14} /> Back to vendors
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {shop.logo ? (
               <div className="relative h-20 w-24 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 shrink-0">
                 <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
               </div>
            ) : (
              <div className="h-20 w-20 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0">
                <ShoppingBag size={32} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{shop.name}</h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-tighter">
                   <ShieldCheck size={10} /> Verified Vendor
                </div>
              </div>
              <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed">
                {shop.description}
              </p>
              <div className="flex items-center gap-6 mt-6">
                 <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                    <MapPin size={14} className="text-zinc-400" />
                    <span>Campus Pickup</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                    <ShoppingBag size={14} className="text-zinc-400" />
                    <span>{shop.products?.length || 0} items listed</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-zinc-100">
           <h2 className="text-lg font-semibold text-zinc-900">Featured Inventory</h2>
           <p className="text-xs text-zinc-400 font-medium">Showing {shop.products?.length || 0} products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {shop.products?.map((product: any) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white border border-zinc-100 mb-4 transition-all group-hover:border-zinc-200 group-hover:shadow-sm">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0].image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-200">
                    <ShoppingBag size={48} />
                  </div>
                )}
                {product.is_on_sale && (
                  <div className="absolute top-2 left-2 bg-sokoline-accent text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-tighter">
                    Sale
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-zinc-900 group-hover:text-sokoline-accent transition-colors line-clamp-1">
                  {product.name}
                </h3>
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
                   <span className="text-[11px] font-medium text-zinc-600">{(product.average_rating || 0).toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!shop.products || shop.products.length === 0) && (
          <div className="py-20 text-center bg-white border border-dashed border-zinc-200 rounded-lg">
            <p className="text-zinc-500 text-sm font-medium">This vendor has no items listed at the moment.</p>
          </div>
        )}
      </section>
    </main>
  );
}
