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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-xl font-bold text-gray-900">Vendor not found</h1>
        <Link href="/shops" className="text-teal-500 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to shops
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20">
      {/* Navigation */}
      <div className="mt-6 py-4 border-b border-gray-200">
          <Link href="/shops" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to vendors
          </Link>
      </div>

      {/* Shop Header (PRISTINE bg-gray-100 box) */}
      <section className="mt-6 px-8 py-12 bg-gray-100 rounded-xl">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {shop.logo ? (
               <div className="relative h-24 w-32 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0 shadow-sm">
                 <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
               </div>
            ) : (
              <div className="h-24 w-24 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-300 shrink-0 shadow-sm">
                <ShoppingBag size={40} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{shop.name}</h1>
                <div className="flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-black bg-green-50 text-green-700 border border-green-100 uppercase tracking-widest">
                   Verified Vendor
                </div>
              </div>
              <p className="text-gray-600 text-lg font-medium max-w-2xl leading-relaxed">
                {shop.description}
              </p>
              <div className="flex items-center gap-6 mt-6">
                 <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <MapPin size={14} className="text-teal-500" />
                    <span>Campus Pickup</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <ShoppingBag size={14} className="text-teal-500" />
                    <span>{shop.products?.length || 0} Listings</span>
                 </div>
              </div>
            </div>
          </div>
      </section>

      {/* Products Grid (PRISTINE section) */}
      <section className="mt-6 px-8 py-12 bg-gray-100 rounded-xl">
        <h2 className="mb-12 text-2xl text-center font-bold text-gray-900">Featured Inventory</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shop.products?.map((product: any) => (
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
                  <div className="flex items-center gap-1 mt-4">
                     <Star size={12} className="fill-orange-400 text-orange-400" />
                     <span className="text-xs font-semibold text-gray-600">{(product.average_rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {(!shop.products || shop.products.length === 0) && (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">This vendor has no items listed yet</p>
          </div>
        )}
      </section>
    </main>
  );
}
