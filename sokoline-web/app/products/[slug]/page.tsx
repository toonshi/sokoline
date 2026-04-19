import React from 'react';
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { mockProducts } from "@/lib/mockProducts";
import ProductHero from './components/ProductHero';
import ProductInfoTabs from './components/ProductInfoTabs';
import ReviewSection from './components/ReviewSection';
import FAQSection from './components/FAQSection';
import RelatedProducts from './components/RelatedProducts';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const fetchedProduct = await getProduct(slug);
  const product = fetchedProduct || mockProducts.find((item) => item.slug === slug) || null;

  if (!product) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Section: Navigation and Product Purchase */}
        <div className="px-4 md:px-10">
          <ProductHero product={product} />
        </div>

        {/* Middle Section: Technical Details */}
        <div className="mt-6 border-t border-zinc-200 bg-white">
          <ProductInfoTabs product={product} />
        </div>

        {/* Social Proof & Trust Sections */}
        <div className="space-y-4 border-y border-zinc-200 bg-white">
          <ReviewSection product={product} />
          <FAQSection />
        </div>

        {/* Discovery Section */}
        <RelatedProducts productId={product.id} />
        
      </div>
    </main>
  );
}
