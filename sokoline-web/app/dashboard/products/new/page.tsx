"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, getCategories, createProduct } from "@/lib/api";
import { Category } from "@/lib/types";
import { ArrowLeft, Save, Loader2, Package, Tag, DollarSign, ListTree } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [shopId, setShopId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "0",
    shipping_info: "",
    return_policy: "",
  });

  useEffect(() => {
    const initPage = async () => {
      try {
        const token = await getToken();
        if (token) {
          const [shop, cats] = await Promise.all([
            fetchMyShop(token),
            getCategories()
          ]);
          if (shop) setShopId(shop.id);
          setCategories(cats);
        }
      } catch (err) {
        console.error("Init failed:", err);
      }
    };

    if (isLoaded && isSignedIn) {
      initPage();
    }
  }, [isLoaded, isSignedIn, getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      if (token) {
        const product = await createProduct(token, {
          ...formData,
          shop: shopId,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        });
        
        if (product) {
          router.push("/dashboard/products");
        } else {
          setError("Failed to create product. Please check your inputs.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/dashboard/products" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-12 hover:text-sokoline-accent transition-colors">
          <ArrowLeft size={14} /> Back to Inventory
        </Link>

        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase">List New Product</h1>
            <p className="text-muted-foreground mt-4 text-lg font-medium">Add a new student venture product to your shop.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
            <div className="space-y-8">
              <div className="bg-card rounded-[32px] border border-border p-8 space-y-6">
                 <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                   <Package size={20} className="text-sokoline-accent" /> Basic Info
                 </h2>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Product Name</label>
                   <input 
                     required
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full bg-background border border-border rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-sokoline-accent"
                     placeholder="e.g. Vintage Leather Bag"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Description</label>
                   <textarea 
                     required
                     rows={4}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full bg-background border border-border rounded-2xl py-4 px-6 font-medium outline-none focus:ring-2 focus:ring-sokoline-accent"
                     placeholder="Tell the story of your product..."
                   />
                 </div>
              </div>

              <div className="bg-card rounded-[32px] border border-border p-8 space-y-6">
                 <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                   <ListTree size={20} className="text-sokoline-accent" /> Classification
                 </h2>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</label>
                   <select 
                     required
                     value={formData.category}
                     onChange={(e) => setFormData({...formData, category: e.target.value})}
                     className="w-full bg-background border border-border rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-sokoline-accent appearance-none"
                   >
                     <option value="">Select a category</option>
                     {categories.map(cat => (
                       <option key={cat.id} value={cat.id}>{cat.name}</option>
                     ))}
                   </select>
                 </div>
              </div>
            </div>

            {/* Right Column: Price & Stock */}
            <div className="space-y-8">
               <div className="bg-card rounded-[32px] border border-border p-8 space-y-6">
                 <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                   <DollarSign size={20} className="text-sokoline-accent" /> Pricing & Inventory
                 </h2>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Base Price</label>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-background border border-border rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-sokoline-accent"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Stock</label>
                      <input 
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full bg-background border border-border rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-sokoline-accent"
                        placeholder="0"
                      />
                    </div>
                 </div>
               </div>

               <div className="bg-card rounded-[32px] border border-border p-8 space-y-6">
                 <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                   <Tag size={20} className="text-sokoline-accent" /> Additional Details
                 </h2>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Shipping Info</label>
                   <input 
                     value={formData.shipping_info}
                     onChange={(e) => setFormData({...formData, shipping_info: e.target.value})}
                     className="w-full bg-background border border-border rounded-2xl py-4 px-6 font-medium outline-none focus:ring-2 focus:ring-sokoline-accent"
                     placeholder="e.g. Pick up at Juja Gate"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Return Policy</label>
                   <input 
                     value={formData.return_policy}
                     onChange={(e) => setFormData({...formData, return_policy: e.target.value})}
                     className="w-full bg-background border border-border rounded-2xl py-4 px-6 font-medium outline-none focus:ring-2 focus:ring-sokoline-accent"
                     placeholder="e.g. Returns within 2 days"
                   />
                 </div>
               </div>

               {error && (
                 <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-6 font-bold text-sm">
                   {error}
                 </div>
               )}

               <button 
                 type="submit"
                 disabled={isSubmitting || !shopId}
                 className="w-full bg-sokoline-accent text-white py-6 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sokoline-accent-hover transition-all shadow-2xl shadow-sokoline-accent/20 active:scale-95 disabled:opacity-50"
               >
                 {isSubmitting ? (
                   <>
                     <Loader2 size={24} className="animate-spin" />
                     Publishing...
                   </>
                 ) : (
                   <>
                     Publish Product <Save size={20} />
                   </>
                 )}
               </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
