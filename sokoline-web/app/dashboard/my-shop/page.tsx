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
          alert("Shop updated successfully!");
        }
      }
    } catch (error) {
      console.error("Failed to update shop:", error);
      alert("Update failed. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sokoline-accent"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-black uppercase mb-4">No Shop Found</h2>
        <p className="text-muted-foreground mb-8 font-medium">You haven't created a student venture yet.</p>
        <button className="bg-sokoline-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
          Launch Your Shop
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase">My Shop</h1>
          <p className="text-muted-foreground mt-4 text-lg font-medium">
            Define your brand and tell your venture's story.
          </p>
        </div>
        <Link 
          href={`/shops/${shop.slug}`} 
          className="p-4 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-sokoline-accent transition-all"
        >
          <ExternalLink size={20} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-[40px] p-10 space-y-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Venture Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-muted border-2 border-transparent focus:border-sokoline-accent outline-none font-bold text-foreground transition-all"
                placeholder="e.g. Campus Goggles"
                required
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Public URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground/50">sokoline.app/shops/</span>
                <input 
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="flex-1 px-6 py-4 rounded-2xl bg-muted border-2 border-transparent focus:border-sokoline-accent outline-none font-bold text-foreground transition-all"
                  placeholder="campus-goggles"
                  required
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Venture Bio</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-muted border-2 border-transparent focus:border-sokoline-accent outline-none font-medium text-foreground transition-all min-h-[150px]"
                placeholder="Tell students why they should support you..."
                required
              />
           </div>
        </div>

        {/* Logo Section (Placeholder) */}
        <div className="bg-muted/50 rounded-[40px] p-10 border border-border flex flex-col items-center text-center gap-6">
           <div className="h-24 w-24 rounded-[32px] bg-background border border-border flex items-center justify-center text-muted-foreground shadow-sm">
              <Store size={40} />
           </div>
           <div>
              <h3 className="font-bold text-foreground uppercase">Venture Logo</h3>
              <p className="text-xs text-muted-foreground mt-1">Recommended: Square PNG/JPG, max 2MB.</p>
           </div>
           <button type="button" className="px-6 py-2.5 rounded-full border-2 border-sokoline-accent text-sokoline-accent text-xs font-black uppercase tracking-widest hover:bg-sokoline-accent hover:text-white transition-all">
              Choose File
           </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
           <button 
             type="submit"
             disabled={saving}
             className="bg-sokoline-accent text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-sokoline-accent-hover transition-all shadow-2xl shadow-sokoline-accent/20 active:scale-95 disabled:opacity-50"
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
