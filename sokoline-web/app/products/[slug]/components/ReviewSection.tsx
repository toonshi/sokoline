"use client";

import React, { useEffect, useState } from 'react';
import { Product, Review } from "@/lib/types";
import { getReviews } from "@/lib/api";
import { Star, ChevronDown, User, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface ReviewSectionProps {
  product: Product;
}

export default function ReviewSection({ product }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;

  const loadReviews = async (newOffset: number) => {
    setLoading(true);
    try {
      const data = await getReviews(product.id, LIMIT, newOffset);
      if (data.length < LIMIT) {
        setHasMore(false);
      }
      if (newOffset === 0) {
        setReviews(data);
      } else {
        setReviews(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(0);
  }, [product.id]);

  const handleSeeMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    loadReviews(nextOffset);
  };

  return (
    <section className="bg-zinc-50/50 py-20 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Summary (Baymard: Quick glance accessibility) */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.round(product.average_rating) ? "fill-orange-400 text-orange-400" : "text-zinc-200"} />
                  ))}
                </div>
                <span className="text-lg font-bold text-zinc-900">{product.average_rating.toFixed(1)} out of 5</span>
              </div>
              <p className="text-sm text-zinc-500 mt-2">Based on {product.review_count} verified student purchases</p>
            </div>

            {/* Rating Breakdown (Shopify Style) */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length; // Mock logic for breakdown
                const percentage = product.review_count > 0 ? (count / product.review_count) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-4 text-xs font-medium text-zinc-600">
                    <span className="w-12 underline underline-offset-2">{rating} stars</span>
                    <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-400 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-8 text-right text-zinc-400">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
            </div>

            {/* Customer Media (Baymard: Real-world visuals) */}
            <div className="pt-8 border-t border-zinc-200">
               <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                 <ImageIcon size={16} /> Customer photos
               </h3>
               <div className="flex gap-2">
                  <div className="w-16 h-16 rounded bg-zinc-200 flex items-center justify-center text-zinc-400 border border-zinc-300 border-dashed">
                     <ImageIcon size={20} />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium italic max-w-[120px]">User-submitted photos coming soon for this shop.</p>
               </div>
            </div>
          </div>

          {/* Right Column: Review List */}
          <div className="lg:col-span-8">
             <div className="space-y-10 divide-y divide-zinc-200">
                {reviews.map((review) => (
                  <div key={review.id} className="pt-10 first:pt-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xs border border-zinc-200 uppercase">
                           {review.user.first_name[0]}{review.user.last_name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 text-sm">{review.user.first_name} {review.user.last_name[0]}.</span>
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-bold border border-green-100 uppercase tracking-tighter">
                               <CheckCircle2 size={10} /> Verified Purchase
                            </div>
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">{new Date(review.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-orange-400 text-orange-400" : "text-zinc-100"} />
                        ))}
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-zinc-900 mb-2">Excellent Campus Essential</h4>
                    <p className="text-zinc-600 leading-relaxed text-sm">
                      {review.comment}
                    </p>
                    
                    <div className="mt-6 flex items-center gap-4 text-xs font-medium text-zinc-400">
                       <button className="hover:text-zinc-900 underline underline-offset-4">Helpful (0)</button>
                       <button className="hover:text-zinc-900 underline underline-offset-4">Report</button>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && !loading && (
                  <div className="py-20 text-center bg-white rounded-lg border border-dashed border-zinc-300">
                    <p className="text-sm text-zinc-500">No student reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
             </div>

             {hasMore && reviews.length > 0 && (
              <div className="mt-12 flex justify-center border-t border-zinc-100 pt-10">
                <button 
                  onClick={handleSeeMore}
                  disabled={loading}
                  className="px-8 py-3 bg-white border border-zinc-300 rounded-md text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Read more reviews
                  {!loading && <ChevronDown size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Internal helper
function Loader2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
