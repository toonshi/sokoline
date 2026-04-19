"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, getProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { Plus, Edit2, Trash2, ExternalLink, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
        <Button 
          render={<Link href="/dashboard/products/new" />} 
          className="bg-sokoline-accent hover:bg-sokoline-accent/90"
        >
          <Plus size={16} className="mr-2" />
          Add product
        </Button>
      </div>

      {/* Table Section */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="h-12 w-12 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-100">
                 <Package size={24} />
               </div>
               <h2 className="text-base font-semibold text-foreground">No products found</h2>
               <p className="text-zinc-500 text-sm max-w-xs mt-1">Start by adding your first product to your shop.</p>
               <Button variant="link" render={<Link href="/dashboard/products/new" />} className="text-sokoline-accent mt-4">
                 Create product
               </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/50">
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="group transition-colors">
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                       <Badge variant={product.stock > 0 ? "default" : "secondary"} className={product.stock > 0 ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-50" : ""}>
                         {product.stock > 0 ? "Active" : "Draft"}
                       </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${product.stock <= 5 ? "text-orange-600 font-medium" : "text-zinc-600"}`}>
                        {product.stock} in stock
                      </span>
                    </TableCell>
                    <TableCell>
                       <span className="text-sm text-zinc-500">{product.category?.name || "Uncategorized"}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-medium text-zinc-900">${product.price}</span>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" render={<Link href={`/products/${product.slug}`} title="View on site" />}>
                             <ExternalLink size={14} />
                          </Button>
                          <Button variant="ghost" size="icon-sm" title="Edit">
                             <Edit2 size={14} />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-zinc-400 hover:text-red-600" title="Delete">
                             <Trash2 size={14} />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
