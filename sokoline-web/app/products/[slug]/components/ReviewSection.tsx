"use client";

import React, { useEffect, useState } from 'react';
import { Product, Review } from "@/lib/types";
import { getReviews } from "@/lib/api";
import { Star, ChevronDown, User } from "lucide-react";

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
    const data = await getReviews(product.id, LIMIT, newOffset);
    if (data.length < LIMIT) {
      setHasMore(false);
    }
    setReviews(prev => [...prev, ...data]);
    setLoading(false);
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
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
        <div>
           <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">Community feedback</h2>
           <p className="text-zinc-500 text-sm">Real reviews from students who bought this.</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 tracking-tight">{product.average_rating.toFixed(1)}</div>
              <div className="flex gap-1 mt-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.average_rating) ? "fill-sokoline-accent text-sokoline-accent" : "text-zinc-200"} />
                ))}
              </div>
           </div>
           <div className="h-10 w-px bg-zinc-200" />
           <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 tracking-tight">{product.review_count}</div>
              <div className="text-xs text-zinc-500 mt-1">Total reviews</div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-5 rounded-lg border border-zinc-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-sokoline-accent">
                   <User size={18} />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 text-sm">{review.user.first_name} {review.user.last_name[0]}.</div>
                  <div className="text-xs text-zinc-500">{new Date(review.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? "fill-sokoline-accent text-sokoline-accent" : "text-zinc-100"} />
                ))}
              </div>
            </div>
            <p className="text-zinc-600 leading-relaxed text-sm max-w-2xl">
              {review.comment}
            </p>
          </div>
        ))}

        {reviews.length === 0 && !loading && (
          <div className="py-10 text-center text-zinc-400 text-sm border border-dashed border-zinc-200 rounded-lg">
            No reviews yet. Be the first student to review this product!
          </div>
        )}

        {hasMore && reviews.length > 0 && (
          <div className="flex justify-center mt-6">
            <button 
              onClick={handleSeeMore}
              disabled={loading}
              className="flex items-center gap-2 rounded-md border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More Experiences"}
              {!loading && <ChevronDown size={18} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
