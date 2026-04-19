"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductVariant } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import FeaturesBar from './FeaturesBar';
import { Check, ShoppingCart, Star, Heart, Ruler, Info, Loader2 } from "lucide-react";

interface ProductHeroProps {
  product: Product;
}

const getOptionKey = (variant: ProductVariant) => JSON.stringify([variant.name, variant.size || ""]);

export default function ProductHero({ product }: ProductHeroProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [activeImg, setActiveImg] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Derived data
  const currentPrice = selectedVariant?.price_override || product.discount_price || product.price;
  const originalPrice = product.is_on_sale ? product.price : null;
  
  const allImages = product.images.length > 0 
    ? product.images 
    : [{ id: 0, image: "/placeholder-product.png", alt_text: product.name, is_feature: true }];

  const handleAddToCart = async () => {
    setIsAdding(true);
    const idToTrack = selectedVariant ? selectedVariant.id : product.id;
    await addItem(idToTrack, 1);
    setIsAdding(false);
  };

  const uniqueColors = product.variants
    .filter((variant) => variant.color_hex)
    .reduce<ProductVariant[]>((acc, variant) => {
      if (!acc.some((item) => item.color_hex === variant.color_hex)) {
        acc.push(variant);
      }
      return acc;
    }, []);

  const uniqueOptions = product.variants.reduce<ProductVariant[]>((acc, variant) => {
    if (!acc.some((item) => getOptionKey(item) === getOptionKey(variant))) {
      acc.push(variant);
    }
    return acc;
  }, []);

  const selectedVariantImage = selectedVariant?.image
    ? allImages.find((img) => img.id === selectedVariant.image)
    : null;
  const imageSource =
    selectedVariant?.image_url ||
    selectedVariantImage?.image ||
    allImages[activeImg]?.image ||
    "/placeholder-product.png";
  const imageAlt = selectedVariantImage?.alt_text || allImages[activeImg]?.alt_text || product.name;

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Gallery (Baymard: Multi-angle, high res) */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
              <Image
                src={imageSource}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
              {product.is_on_sale && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wide shadow-sm">
                  Sale
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  type="button"
                  className={`relative aspect-square overflow-hidden rounded-md border transition-all ${
                    activeImg === i ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <Image src={img.image} alt={img.alt_text || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
            
            {/* Scale/Size Hint (Baymard Best Practice) */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Ruler size={18} className="text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-600">Need help with size or scale?</span>
               </div>
               <button className="text-xs font-semibold text-zinc-900 underline underline-offset-4">Scale Guide</button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <li><Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link></li>
                <li className="h-1 w-1 rounded-full bg-zinc-300" />
                <li><Link href="/products" className="hover:text-zinc-900 transition-colors">{product.category?.name || "Products"}</Link></li>
              </ol>
            </nav>

            <h1 className="text-3xl font-semibold text-zinc-900 leading-tight">
              {product.name}
            </h1>
            
            <div className="mt-4 flex items-center gap-4">
               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-md">
                 <Star size={14} className="fill-orange-400 text-orange-400" />
                 <span className="text-sm font-bold text-zinc-900">{product.average_rating.toFixed(1)}</span>
               </div>
               <div className="h-4 w-px bg-zinc-200" />
               <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 underline underline-offset-4">
                 {product.review_count} verified reviews
               </button>
            </div>

            <div className="mt-8 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-zinc-900">${currentPrice}</span>
              {originalPrice && (
                <span className="text-lg text-zinc-400 line-through">${originalPrice}</span>
              )}
            </div>

            <div className="mt-2 text-sm text-zinc-500">
               Prices in USD. Taxes included. 
               <span className="ml-2 font-medium text-zinc-900 flex items-center gap-1 inline-flex">
                 <Info size={12} /> Student discounts applied
               </span>
            </div>

            <div className="h-px bg-zinc-100 my-8" />

            {/* Variant Selectors (Baymard: Buttons > Dropdowns) */}
            {uniqueColors.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-zinc-900 uppercase tracking-tight">Select Color</p>
                  <span className="text-xs text-zinc-500 font-medium">{selectedVariant?.color_name || "Pick an option"}</span>
                </div>
                <div className="flex items-center gap-3">
                  {uniqueColors.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      type="button"
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                        selectedVariant?.color_hex === variant.color_hex ? "border-zinc-900" : "border-transparent"
                      }`}
                      style={{ padding: '2px' }}
                    >
                      <div 
                        className="w-full h-full rounded-full border border-black/10" 
                        style={{ backgroundColor: variant.color_hex || "#E4E4E7" }}
                      />
                      {selectedVariant?.color_hex === variant.color_hex && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-zinc-900 uppercase tracking-tight">Select Size / Option</p>
                  <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5">
                    <Ruler size={12} /> Size chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueOptions.map((variant) => (
                    <button
                      key={getOptionKey(variant)}
                      onClick={() => setSelectedVariant(variant)}
                      type="button"
                      className={`min-w-[64px] rounded-md border py-2.5 px-4 text-xs font-semibold transition-all ${
                        (selectedVariant ? getOptionKey(selectedVariant) === getOptionKey(variant) : false)
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      {variant.size || variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons (Baymard: Primary CTA Visibility) */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-zinc-900 text-white py-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {isAdding ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart — ${currentPrice}
                  </>
                )}
              </button>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-14 h-14 border border-zinc-200 rounded-md flex items-center justify-center transition-all hover:bg-zinc-50 ${
                  isWishlisted ? "text-rose-500 border-rose-100 bg-rose-50" : "text-zinc-400"
                }`}
              >
                <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
              </button>
            </div>

            {/* Institutional Trust Features (Baymard: Policy Visibility) */}
            <div className="mt-12 space-y-8">
               <FeaturesBar 
                 hasFreeShipping={product.has_free_shipping}
                 hasFreeReturns={product.has_free_returns}
               />
               
               <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Seller Notes</p>
                  <p className="text-xs text-zinc-600 leading-relaxed italic">
                    "This product is crafted by a student entrepreneur. Every purchase directly supports their venture and campus innovation."
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
