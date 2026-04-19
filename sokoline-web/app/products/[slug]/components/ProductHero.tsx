"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductVariant } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import FeaturesBar from './FeaturesBar';
import { Check, ShoppingCart, Star } from "lucide-react";

interface ProductHeroProps {
  product: Product;
}

// Prefer a word boundary when it appears after at least 60% of the max length.
const MIN_WORD_BOUNDARY_THRESHOLD = 0.6;

const getOptionKey = (variant: ProductVariant) => JSON.stringify([variant.name, variant.size || ""]);

const truncateAtWord = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength + 1);
  const wordBoundary = sliced.lastIndexOf(" ");
  const trimmed = (
    wordBoundary > Math.floor(maxLength * MIN_WORD_BOUNDARY_THRESHOLD)
      ? sliced.slice(0, wordBoundary)
      : text.slice(0, maxLength)
  ).trimEnd();
  return `${trimmed}...`;
};

export default function ProductHero({ product }: ProductHeroProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [activeImg, setActiveImg] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Derived data
  const currentPrice = selectedVariant?.price_override || product.discount_price || product.price;
  const originalPrice = product.is_on_sale ? product.price : null;
  const discountPercent = product.is_on_sale 
    ? Math.round((1 - (Number(product.discount_price) / Number(product.price))) * 100) 
    : null;
  
  const allImages = product.images.length > 0 
    ? product.images 
    : [{ id: 0, image: "/placeholder-product.png", alt_text: product.name, is_feature: true }];

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Use variant ID if selected, otherwise product ID
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

  const shortDescription = truncateAtWord(product.description, 100);
  const productPath = product.category?.name || "Products";

  const handleColorSelect = (colorHex: string) => {
    const preferred = product.variants.find(
      (variant) =>
        variant.color_hex === colorHex &&
        variant.name === selectedVariant?.name &&
        variant.size === selectedVariant?.size
    );
    const fallback = product.variants.find((variant) => variant.color_hex === colorHex);
    setSelectedVariant(preferred || fallback || null);
  };

  const handleOptionSelect = (option: ProductVariant) => {
    const optionKey = getOptionKey(option);
    const preferred = product.variants.find(
      (variant) => getOptionKey(variant) === optionKey && variant.color_hex === selectedVariant?.color_hex
    );
    const fallback = product.variants.find((variant) => getOptionKey(variant) === optionKey);
    setSelectedVariant(preferred || fallback || null);
  };

  return (
    <section className="py-4 md:py-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:p-6">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
            <li>Home</li>
            <li aria-hidden="true">&gt;</li>
            <li>{productPath}</li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-semibold text-zinc-700">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
              <Image
                src={imageSource}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  type="button"
                  className={`relative aspect-square overflow-hidden rounded-md border ${
                    activeImg === i ? "border-sokoline-accent" : "border-zinc-200"
                  }`}
                  aria-label={`View ${img.alt_text || `image ${i + 1}`}`}
                >
                  <Image src={img.image} alt={img.alt_text || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold leading-snug text-zinc-900 md:text-3xl">
              {product.name}
            </h1>
            <div className="mt-2 text-sm text-zinc-500">
              <p>Sold by <span className="font-medium text-zinc-700">{product.shop_name}</span>.</p>
              <p>{shortDescription}</p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-zinc-900">{product.average_rating.toFixed(1)}</span>
              <span className="text-zinc-500">{product.review_count} reviews</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              {originalPrice && (
                <span className="text-sm text-zinc-400 line-through">${originalPrice}</span>
              )}
              <span className="text-3xl font-bold text-zinc-900">${currentPrice}</span>
              {discountPercent ? (
                <span className="text-sm font-semibold text-rose-500">-{discountPercent}%</span>
              ) : null}
            </div>

            {uniqueColors.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-zinc-700">Color</p>
                <div className="flex items-center gap-2">
                  {uniqueColors.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleColorSelect(variant.color_hex)}
                      type="button"
                      className={`relative flex h-6 w-6 items-center justify-center rounded-full border ${
                        selectedVariant?.color_hex === variant.color_hex ? "ring-2 ring-sokoline-accent ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: variant.color_hex || "#E4E4E7" }}
                      aria-label={variant.color_name || variant.name}
                    >
                      {selectedVariant?.color_hex === variant.color_hex ? (
                        <Check size={12} className="text-white drop-shadow-sm" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-zinc-700">Options</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueOptions.map((variant) => (
                    <button
                      key={getOptionKey(variant)}
                      onClick={() => handleOptionSelect(variant)}
                      type="button"
                      className={`rounded-md border px-3 py-1.5 text-sm ${
                        (selectedVariant ? getOptionKey(selectedVariant) === getOptionKey(variant) : false)
                          ? "border-sokoline-accent bg-sokoline-accent text-white"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      {variant.size ? `${variant.name} (${variant.size})` : variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition sm:w-fit ${
                isAdding
                  ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                  : "bg-sokoline-accent text-white hover:bg-sokoline-accent-hover"
              }`}
            >
              <ShoppingCart size={16} />
              {isAdding ? "Adding..." : "Add to cart"}
            </button>

            <FeaturesBar
              className="mt-6 grid-cols-2 border-t border-zinc-200 pt-4"
              hasFreeShipping={product.has_free_shipping}
              hasFreeReturns={product.has_free_returns}
              hasSafetyCertification={product.is_safety_certified}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
