import Image from "next/image";
import Link from "next/link";
import { Store, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

async function getShops() {
  try {
    const envUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app").replace(/\/$/, "");
    const res = await fetch(`${envUrl}/api/shops/`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    return [];
  }
}

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20">
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4 py-4 border-b border-gray-200">
         <h1 className="text-2xl font-bold text-gray-900">Browse campus vendors</h1>
      </div>

      <div className="mt-6 px-6 py-12 bg-gray-100 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shops.map((shop: any) => (
            <div key={shop.id} className="group">
              <Link href={`/shops/${shop.slug}`}>
                <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-white border-b border-gray-100">
                  {shop.logo ? (
                    <Image 
                      src={shop.logo} 
                      alt={shop.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-200">
                      <Store size={48} />
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white rounded-b-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-teal-500 transition-colors">{shop.name}</h2>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-teal-500 transition-colors" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 h-10 mb-4">
                    {shop.description || "Campus-verified student venture providing high-quality services and products."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-tighter">
                      {shop.category || "General"}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-tighter">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {shops.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-gray-300 gap-4 mx-6">
            <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
               <Store size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">No shops available</h2>
              <p className="text-gray-500 text-sm max-w-xs mt-1">Stay tuned for new student ventures launching soon!</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
