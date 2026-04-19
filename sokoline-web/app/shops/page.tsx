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
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-200 pb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-2">Campus Vendors</h1>
          <p className="text-zinc-500 text-sm max-w-xl">
            Support student entrepreneurs. Every shop is verified and operated by students within the campus ecosystem.
          </p>
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop: any) => (
            <Link 
              key={shop.id} 
              href={`/shops/${shop.slug}`}
              className="group bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md hover:border-zinc-300 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-md bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-sokoline-accent transition-colors">
                  <Store size={24} />
                </div>
                <div className="text-zinc-300 group-hover:text-zinc-900 transition-colors">
                  <ArrowRight size={18} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">{shop.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-zinc-500">
                    <MapPin size={12} />
                    <span className="text-xs font-medium">Campus Verified</span>
                  </div>
                </div>

                <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2 h-8">
                  {shop.description || "A student-led business specializing in high-quality products and services for the campus community."}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase tracking-tighter">
                    {shop.category || "General"}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100 uppercase tracking-tighter">
                    <ShieldCheck size={10} /> Verified
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {shops.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-lg border border-dashed border-zinc-200 gap-4">
            <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 border border-zinc-100">
               <Store size={24} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">No shops available</h2>
              <p className="text-zinc-500 text-sm max-w-xs mt-1">Stay tuned for new student ventures launching soon!</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
