import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

async function getShopData(slug: string) {
  const res = await fetch(`https://api.sokoline.app/api/shops/${slug}/`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shop = await getShopData(slug);

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-4xl font-bold text-muted-foreground">Shop Not Found</h1>
        <Link href="/shops" className="text-sokoline-accent hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Shops
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Shop Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 md:px-10">
          <Link href="/shops" className="text-sm font-bold text-sokoline-accent uppercase tracking-widest flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity">
            <ArrowLeft size={14} /> Back to all shops
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {shop.logo ? (
               <div className="relative h-24 w-24 rounded-3xl overflow-hidden border border-border">
                 <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
               </div>
            ) : (
              <div className="h-24 w-24 rounded-3xl bg-sokoline-accent/10 flex items-center justify-center text-sokoline-accent">
                <ShoppingBag size={40} />
              </div>
            )}
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-foreground">{shop.name}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-lg leading-relaxed">
                {shop.description}
              </p>
              <div className="flex gap-4 mt-6">
                 <span className="text-xs font-semibold uppercase tracking-widest px-4 py-2 bg-muted rounded-full text-muted-foreground">
                   Student Owned
                 </span>
                 <span className="text-xs font-semibold uppercase tracking-widest px-4 py-2 bg-sokoline-accent/10 rounded-full text-sokoline-accent">
                   Verified Campus Vendor
                 </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:px-10">
        <div className="flex justify-between items-end mb-12">
           <h2 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h2>
           <p className="text-sm text-muted-foreground font-medium">{shop.products?.length || 0} Products available</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {shop.products?.map((product: any) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-muted mb-6">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0].image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground group-hover:scale-110 transition-transform">
                    <ShoppingBag size={48} />
                  </div>
                )}
                {product.is_on_sale && (
                  <div className="absolute top-4 left-4 bg-sokoline-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                    Sale
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-sokoline-accent transition-colors line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-bold text-foreground">
                  ${product.discount_price || product.price}
                </span>
                {product.is_on_sale && (
                  <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                    ${product.price}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {(!shop.products || shop.products.length === 0) && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[32px]">
            <p className="text-muted-foreground font-medium">This vendor hasn't listed any products yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}
