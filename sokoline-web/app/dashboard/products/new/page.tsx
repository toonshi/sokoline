"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, getCategories, createProduct } from "@/lib/api";
import { Category } from "@/lib/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Button variant="ghost" size="sm" render={<Link href="/dashboard/products" />} className="mb-8 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} className="mr-2" /> Products
        </Button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Add product</h1>
          <div className="flex gap-3">
             <Button variant="outline" render={<Link href="/dashboard/products" />}>Cancel</Button>
             <Button 
               onClick={handleSubmit}
               disabled={isSubmitting || !shopId}
               className="bg-sokoline-accent hover:bg-sokoline-accent/90"
             >
               {isSubmitting && <Loader2 size={14} className="mr-2 animate-spin" />}
               Save product
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Short sleeve t-shirt"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description"
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your product in detail..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input 
                      id="price"
                      required
                      type="number"
                      step="0.01"
                      className="pl-7"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Quantity</Label>
                  <Input 
                    id="stock"
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Shipping & Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping Policy</Label>
                  <Input 
                    id="shipping"
                    value={formData.shipping_info}
                    onChange={(e) => setFormData({...formData, shipping_info: e.target.value})}
                    placeholder="e.g. Ships within 24 hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return">Return Policy</Label>
                  <Input 
                    id="return"
                    value={formData.return_policy}
                    onChange={(e) => setFormData({...formData, return_policy: e.target.value})}
                    placeholder="e.g. 30-day money back guarantee"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val: string | null) => setFormData({...formData, category: val || ""})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Card className="bg-destructive/10 border-destructive/20 shadow-none">
                <CardContent className="p-4 text-xs font-medium text-destructive">
                  {error}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
