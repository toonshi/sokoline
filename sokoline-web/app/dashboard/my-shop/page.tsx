"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, updateShop } from "@/lib/api";
import { Shop } from "@/lib/types";
import { Save, Loader2, Store, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MyShopPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });

  useEffect(() => {
    const loadShop = async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await fetchMyShop(token);
          if (data) {
            setShop(data);
            setFormData({
              name: data.name,
              description: data.description,
              slug: data.slug,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load shop:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      loadShop();
    }
  }, [isLoaded, isSignedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        const updated = await updateShop(token, shop.id, formData);
        if (updated) {
          setShop(updated);
          // Standard system alert
          alert("Venture settings saved.");
        }
      }
    } catch (error) {
      console.error("Failed to update shop:", error);
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-20 bg-gray-100 rounded-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No shop found</h2>
        <p className="text-gray-500 mb-8 font-medium">You haven't launched your venture yet.</p>
        <Link href="/dashboard/my-shop/new" className="inline-block bg-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-sm">
          Launch your venture
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Shop Settings</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Define your brand identity and venture story.
          </p>
        </div>
        <Link 
          href={`/shops/${shop.slug}`} 
          className="p-3 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-teal-500 hover:border-teal-500 transition-all shadow-sm"
        >
          <ExternalLink size={20} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info (PRISTINE bg-gray-100 container) */}
        <div className="bg-gray-100 rounded-xl p-8 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Venture Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:border-teal-500 outline-none font-bold text-gray-900 transition-all"
                placeholder="Name"
                required
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Public Handle</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-400">metric/shops/</span>
                <input 
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="flex-1 px-5 py-3 rounded-xl bg-white border border-gray-200 focus:border-teal-500 outline-none font-bold text-gray-900 transition-all"
                  placeholder="handle"
                  required
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Venture Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:border-teal-500 outline-none font-medium text-gray-900 transition-all min-h-[150px] leading-relaxed"
                placeholder="Tell your story..."
                required
              />
           </div>
        </div>

        {/* Media (PRISTINE bg-gray-100 container) */}
        <div className="bg-gray-100 rounded-xl p-8 flex flex-col items-center text-center gap-6">
           <div className="h-20 w-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-300 shadow-sm">
              <Store size={32} />
           </div>
           <div>
              <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Brand Logo</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium italic">Square JPG or PNG recommended.</p>
           </div>
           <button type="button" className="px-6 py-2 rounded-xl border border-gray-300 bg-white text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all">
              Update Logo
           </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
           <button 
             type="submit"
             disabled={saving}
             className="bg-teal-500 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-teal-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
           >
             {saving ? (
               <>
                 <Loader2 size={24} className="animate-spin" />
                 Saving...
               </>
             ) : (
               <>
                 <Save size={20} />
                 Save Settings
               </>
             )}
           </button>
        </div>
      </form>
    </div>
  );
}
