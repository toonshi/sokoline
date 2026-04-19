"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from "@/lib/types";
import { getRelatedProducts } from "@/lib/api";
import { ShoppingBag } from "lucide-react";

interface RelatedProductsProps {
  productId: number;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      const data = await getRelatedProducts(productId);
      setProducts(data);
      setLoading(false);
    };
    fetchRelated();
  }, [productId]);

  if (products.length === 0 && !loading) return null;

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-start text-left mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Related products</h2>
        <p className="text-zinc-500 mt-2 text-sm max-w-sm">Curated items similar to what you&apos;re seeing now.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-zinc-100 rounded-lg mb-3" />
              <div className="h-4 w-2/3 bg-zinc-100 rounded-full mb-2" />
              <div className="h-6 w-1/3 bg-zinc-100 rounded-full" />
            </div>
          ))
        ) : (
          products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted border border-zinc-200 mb-3 transition-all duration-300 group-hover:shadow-md">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0].image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300">
                    <ShoppingBag size={48} className="group-hover:scale-110 transition-transform" />
                  </div>
                )}
                {product.is_on_sale && (
                  <div className="absolute top-3 left-3 bg-sokoline-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                    Sale
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-sokoline-accent transition-colors line-clamp-1 tracking-tight">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-bold text-zinc-900">
                  ${product.discount_price || product.price}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
