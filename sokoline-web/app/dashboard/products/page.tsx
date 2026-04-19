"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, getProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { Plus, Edit2, Trash2, ExternalLink, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const token = await getToken();
        if (token) {
          const shop = await fetchMyShop(token);
          if (shop) {
            const data = await getProducts({ shop: shop.slug });
            setProducts(data);
          }
        }
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      loadInventory();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sokoline-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase">Inventory</h1>
          <p className="text-muted-foreground mt-4 text-lg font-medium">
            Manage your listings, update stock, and control your store.
          </p>
        </div>
        <Link 
          href="/dashboard/products/new"
          className="bg-sokoline-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-sokoline-accent-hover transition-all shadow-xl shadow-sokoline-accent/20 active:scale-95"
        >
          <Plus size={18} />
          New Product
        </Link>
      </div>

      {/* Table / Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border rounded-[48px] text-center">
           <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground mb-8">
             <Package size={40} />
           </div>
           <h2 className="text-2xl font-bold text-foreground uppercase mb-2">No products yet</h2>
           <p className="text-muted-foreground max-w-xs font-medium mb-8">Ready to start selling? List your first student venture product today.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-[40px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Product</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Price</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Stock</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-muted/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-muted border border-border">
                           {product.images?.[0] ? (
                             <Image src={product.images[0].image} alt={product.name} fill className="object-cover" />
                           ) : (
                             <div className="flex items-center justify-center h-full text-muted-foreground"><Package size={24} /></div>
                           )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground uppercase text-sm">{product.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.category?.name || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-foreground">${product.price}</span>
                      {product.is_on_sale && <span className="ml-2 text-[10px] font-black text-sokoline-accent uppercase italic">Sale</span>}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-sm font-bold text-muted-foreground">{product.stock} units</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/products/${product.slug}`} className="p-2 rounded-xl text-muted-foreground hover:text-sokoline-accent hover:bg-sokoline-accent/10 transition-all">
                             <ExternalLink size={18} />
                          </Link>
                          <button className="p-2 rounded-xl text-muted-foreground hover:text-sokoline-accent hover:bg-sokoline-accent/10 transition-all">
                             <Edit2 size={18} />
                          </button>
                          <button className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
