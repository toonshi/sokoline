"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, getProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { Plus, Edit2, Trash2, ExternalLink, Package, MoreHorizontal } from "lucide-react";
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
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-zinc-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage your listings and track stock levels.
          </p>
        </div>
        <Link 
          href="/dashboard/products/new"
          className="bg-sokoline-accent text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-sokoline-accent/90 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add product
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="h-12 w-12 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-100">
               <Package size={24} />
             </div>
             <h2 className="text-base font-semibold text-foreground">No products found</h2>
             <p className="text-zinc-500 text-sm max-w-xs mt-1">Start by adding your first product to your shop.</p>
             <Link href="/dashboard/products/new" className="text-sokoline-accent text-sm font-medium mt-4 hover:underline">Create product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600">Product</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600">Inventory</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600">Category</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600 text-right">Price</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-600 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded border border-zinc-200 overflow-hidden bg-zinc-50 shrink-0">
                           {product.images?.[0] ? (
                             <Image src={product.images[0].image} alt={product.name} fill className="object-cover" />
                           ) : (
                             <div className="flex items-center justify-center h-full text-zinc-300"><Package size={16} /></div>
                           )}
                        </div>
                        <span className="text-sm font-semibold text-zinc-900 group-hover:text-sokoline-accent transition-colors">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                         product.stock > 0 ? "bg-green-50 text-green-700 border border-green-100" : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                       }`}>
                         {product.stock > 0 ? "Active" : "Draft"}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${product.stock <= 5 ? "text-orange-600 font-medium" : "text-zinc-600"}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm text-zinc-500">{product.category?.name || "Uncategorized"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-zinc-900">${product.price}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1">
                          <Link href={`/products/${product.slug}`} className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded transition-colors" title="View on site">
                             <ExternalLink size={14} />
                          </Link>
                          <button className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded transition-colors" title="Edit">
                             <Edit2 size={14} />
                          </button>
                          <button className="p-1.5 text-zinc-400 hover:text-red-600 rounded transition-colors" title="Delete">
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
