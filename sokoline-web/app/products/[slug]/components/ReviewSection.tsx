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
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mt-6 px-8 py-12 bg-gray-100 rounded-xl">
           <h2 className="mb-12 text-3xl text-center font-bold text-gray-900">Experience & Reviews</h2>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Summary Card */}
              <div className="p-8 bg-white rounded-xl shadow-sm h-fit">
                <div className="text-center space-y-2">
                  <p className="text-5xl font-black text-gray-900">{product.average_rating.toFixed(1)}</p>
                  <div className="flex justify-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className={i < Math.round(product.average_rating) ? "fill-orange-400 text-orange-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest pt-2">Based on {product.review_count} purchases</p>
                </div>

                <div className="mt-8 space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter(r => r.rating === rating).length; 
                    const percentage = product.review_count > 0 ? (count / product.review_count) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <span className="w-12">{rating} stars</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-teal-500 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="w-8 text-right text-gray-400">{Math.round(percentage)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review List */}
              <div className="lg:col-span-2 space-y-4">
                 {reviews.map((review) => (
                   <div key={review.id} className="p-6 bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-200 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-black text-xs border border-gray-200">
                             {review.user.first_name[0]}{review.user.last_name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-sm">{review.user.first_name} {review.user.last_name[0]}.</span>
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-md text-[9px] font-black uppercase tracking-tighter border border-green-100">
                                 Verified Purchase
                              </div>
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{new Date(review.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < review.rating ? "fill-orange-400 text-orange-400" : "text-gray-100"} />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed text-sm font-medium">
                        {review.comment}
                      </p>
                   </div>
                 ))}

                 {reviews.length === 0 && !loading && (
                   <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No student reviews yet</p>
                   </div>
                 )}

                 {hasMore && reviews.length > 0 && (
                   <button 
                     onClick={handleSeeMore}
                     disabled={loading}
                     className="w-full py-4 bg-gray-500 text-white rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {loading && <Loader2 size={18} className="animate-spin" />}
                     Read More Experiences
                     {!loading && <ChevronDown size={18} />}
                   </button>
                 )}
              </div>
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
