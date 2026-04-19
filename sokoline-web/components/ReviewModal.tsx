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
      setError(err.message || "Something went wrong. Have you already reviewed this product?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-background rounded-[40px] border border-border w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="flex justify-between items-center p-8 border-b border-border">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Review Product</h2>
            <p className="text-zinc-500 font-medium text-sm mt-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center block">Rate your experience</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={40} 
                    className={`${
                      (hover || rating) >= star 
                        ? "fill-sokoline-accent text-sokoline-accent" 
                        : "text-zinc-200"
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Your Thoughts</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think of the product and the seller's service?"
              className="w-full bg-muted/50 border border-border rounded-2xl p-6 font-medium outline-none focus:ring-2 focus:ring-sokoline-accent transition-all resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sokoline-accent text-white py-6 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sokoline-accent-hover transition-all shadow-xl shadow-sokoline-accent/20 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Review <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
