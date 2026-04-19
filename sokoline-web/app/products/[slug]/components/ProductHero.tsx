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
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT: Product Gallery (Baymard: Multi-angle, high res) - 3 Columns */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
              <Image
                src={imageSource}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
              {product.is_on_sale && (
                <div className="absolute top-6 left-6 bg-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-sm uppercase tracking-widest shadow-sm">
                  Sale
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-4">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  type="button"
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                    activeImg === i ? "border-teal-500" : "border-transparent"
                  }`}
                >
                  <Image src={img.image} alt={img.alt_text || product.name} fill className="object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info (PRISTINE bg-gray-100 box) - 2 Columns */}
          <div className="lg:col-span-2 p-8 bg-gray-100 rounded-xl flex flex-col h-full">
            <div className="mb-6">
               <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2">
                 {product.name}
               </h1>
               <p className="text-lg text-gray-500 font-medium">Price: ${currentPrice}</p>
               <p className="text-gray-500 font-medium mt-1">Seller: {product.shop_name}</p>
            </div>
            
            <div className="flex items-center gap-2 mb-8">
               <div className="flex gap-0.5">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} size={16} className={i < Math.round(product.average_rating) ? "fill-orange-400 text-orange-400" : "text-gray-200"} />
                 ))}
               </div>
               <span className="text-sm font-bold text-gray-700">{product.average_rating.toFixed(1)}</span>
            </div>

            <div className="space-y-6 flex-1">
                {product.description && (
                  <div>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-2">Description</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Variant Selectors (PRISTINE Teal style) */}
                {(uniqueColors.length > 0 || uniqueOptions.length > 0) && (
                   <div className="space-y-4">
                      {uniqueColors.length > 0 && (
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Options</p>
                           <div className="flex flex-wrap gap-2">
                              {uniqueColors.map((v) => (
                                <button 
                                  key={v.id}
                                  onClick={() => setSelectedVariant(v)}
                                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                                    selectedVariant?.id === v.id ? "bg-teal-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                  }`}
                                >
                                  {v.color_name}
                                </button>
                              ))}
                           </div>
                        </div>
                      )}
                      {uniqueOptions.length > 0 && (
                        <div>
                           <div className="flex flex-wrap gap-2">
                              {uniqueOptions.map((v) => (
                                <button 
                                  key={getOptionKey(v)}
                                  onClick={() => setSelectedVariant(v)}
                                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                                    selectedVariant && getOptionKey(selectedVariant) === getOptionKey(v) ? "bg-teal-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                  }`}
                                >
                                  {v.size || v.name}
                                </button>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-teal-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {isAdding ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={20} /> Add to cart
                  </>
                )}
              </button>
              
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all border-2 ${
                  isWishlisted ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-gray-500 text-white border-transparent hover:bg-gray-700"
                }`}
              >
                <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
                {isWishlisted ? "Saved to wishlist" : "Save for later"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
