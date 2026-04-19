"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, getCategories, createProduct } from "@/lib/api";
import { Category } from "@/lib/types";
import { ArrowLeft, Save, Loader2, Package, Tag, DollarSign, ListTree, ChevronDown } from "lucide-react";
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
          setError("Failed to create product. Please verify your inputs.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <main className="bg-zinc-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard/products" className="text-sm text-muted-foreground flex items-center gap-2 mb-8 hover:text-foreground transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Products
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Add product</h1>
          <div className="flex gap-3">
             <Link href="/dashboard/products" className="px-4 py-2 bg-white border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
               Cancel
             </Link>
             <button 
               onClick={handleSubmit}
               disabled={isSubmitting || !shopId}
               className="px-4 py-2 bg-sokoline-accent text-white rounded-md text-sm font-medium hover:bg-sokoline-accent/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
             >
               {isSubmitting && <Loader2 size={14} className="animate-spin" />}
               Save product
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6 space-y-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-zinc-700">Title</label>
                 <input 
                   required
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-white border border-zinc-300 rounded-md py-2 px-3 text-sm focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent outline-none transition-all placeholder:text-zinc-400"
                   placeholder="Short sleeve t-shirt"
                 />
               </div>

               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-zinc-700">Description</label>
                 <textarea 
                   required
                   rows={6}
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   className="w-full bg-white border border-zinc-300 rounded-md py-2 px-3 text-sm focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent outline-none transition-all placeholder:text-zinc-400"
                   placeholder="Describe your product in detail..."
                 />
               </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
               <h3 className="text-sm font-semibold text-foreground mb-4">Pricing & Inventory</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700">Price (USD)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</div>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-white border border-zinc-300 rounded-md py-2 pl-7 pr-3 text-sm focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700">Quantity</label>
                    <input 
                      required
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-white border border-zinc-300 rounded-md py-2 px-3 text-sm focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
               </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
               <h3 className="text-sm font-semibold text-foreground mb-4">Shipping & Returns</h3>
               <div className="space-y-4">
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-zinc-700">Shipping Policy</label>
                   <input 
                     value={formData.shipping_info}
                     onChange={(e) => setFormData({...formData, shipping_info: e.target.value})}
                     className="w-full bg-white border border-zinc-300 rounded-md py-2 px-3 text-sm focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent outline-none transition-all placeholder:text-zinc-400"
                     placeholder="e.g. Ships within 24 hours"
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-zinc-700">Return Policy</label>
                   <input 
                     value={formData.return_policy}
                     onChange={(e) => setFormData({...formData, return_policy: e.target.value})}
                     className="w-full bg-white border border-zinc-300 rounded-md py-2 px-3 text-sm focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent outline-none transition-all placeholder:text-zinc-400"
                     placeholder="e.g. 30-day money back guarantee"
                   />
                 </div>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
               <h3 className="text-sm font-semibold text-foreground mb-4">Organization</h3>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-zinc-700">Category</label>
                 <div className="relative">
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white border border-zinc-300 rounded-md py-2 pl-3 pr-10 text-sm focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                 </div>
               </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-md p-4 text-xs font-medium">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
