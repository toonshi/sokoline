"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { createShop } from "@/lib/api";
import { Save, Loader2, Store, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateShopPage() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      if (token) {
        const shop = await createShop(token, formData);
        if (shop) {
          router.push("/dashboard/my-shop");
        } else {
          setError("Failed to create shop. This URL handle might already be taken.");
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
    <main className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Launch Venture</h1>
        <p className="text-gray-500 mt-2 font-medium">Create your campus storefront and start selling.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-100 rounded-xl p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Venture Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:border-teal-500 outline-none font-bold text-gray-900 transition-all"
                placeholder="e.g. Campus Tech"
                required
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">URL Handle</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-400">metric/shops/</span>
                <input 
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="flex-1 px-5 py-3 rounded-xl bg-white border border-gray-200 focus:border-teal-500 outline-none font-bold text-gray-900 transition-all"
                  placeholder="campus-tech"
                  required
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Bio</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:border-teal-500 outline-none font-medium text-gray-900 transition-all min-h-[150px]"
                placeholder="Tell students about your venture..."
                required
              />
           </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-6 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
           <Link href="/dashboard" className="px-8 py-4 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-50 transition-all">
              Cancel
           </Link>
           <button 
             type="submit"
             disabled={isSubmitting}
             className="bg-teal-500 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-teal-700 transition-all shadow-md disabled:opacity-50"
           >
             {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Store size={20} />}
             Open Shop
           </button>
        </div>
      </form>
    </main>
  );
}
