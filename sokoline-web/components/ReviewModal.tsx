"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { submitReview } from "@/lib/api";
import { Star, X, Loader2, Send } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: number; name: string };
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, product, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      if (token) {
        await submitReview(token, {
          product: product.id,
          rating,
          comment
        });
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Unable to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/50 backdrop-none">
      <div className="bg-white rounded-lg border border-zinc-200 w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 bg-zinc-50/50">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Review Product</h2>
            <p className="text-zinc-500 text-xs mt-0.5">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-medium text-zinc-700 text-center block">Rating</label>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-95"
                >
                  <Star 
                    size={28} 
                    className={`${
                      (hover || rating) >= star 
                        ? "fill-orange-400 text-orange-400" 
                        : "text-zinc-200"
                    } transition-colors duration-150`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Comments</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full bg-white border border-zinc-300 rounded-md p-3 text-sm outline-none focus:border-sokoline-accent focus:ring-1 focus:ring-sokoline-accent transition-all resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-md p-3 text-[11px] font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-zinc-900 text-white py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
