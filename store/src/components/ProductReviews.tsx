'use client';

import { useState } from 'react';
import { Star, CheckCircle2, MessageCircle } from 'lucide-react';
import { submitReview } from '@/app/actions/reviews';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  author: string;
  isVerified: boolean;
  createdAt: Date;
}

export default function ProductReviews({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  async function handleAction(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    // Add missing rating since it's not a standard input
    formData.append('rating', rating.toString());

    const result = await submitReview(formData);

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // We don't reset form fields here for simplicity, but in a real app you might want to.
      // Optimistically add to list (though revalidatePath will refetch on next load)
      const newReview: Review = {
        id: Math.random().toString(),
        rating,
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        author: formData.get('author') as string,
        isVerified: false,
        createdAt: new Date(),
      };
      setReviews([newReview, ...reviews]);
    }
  }

  return (
    <div className="mt-16 sm:mt-24 border-t border-[#E8E4DC] pt-12 sm:pt-16 max-w-[900px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-[#121212] uppercase tracking-wide mb-3">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex text-[#C5A46D]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    star <= parseFloat(averageRating) ? 'fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-sans font-bold text-base text-[#121212]">
              {averageRating} out of 5
            </span>
            <span className="text-sm text-[#6E6A64]">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12 items-start">
        {/* Review List */}
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <div className="p-8 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DC] text-center">
              <MessageCircle className="w-8 h-8 text-[#C5A46D] mx-auto mb-3 opacity-50" />
              <h3 className="font-sans font-semibold text-base text-[#121212] mb-1">
                No Reviews Yet
              </h3>
              <p className="text-sm text-[#6E6A64] font-light">
                Be the first to share your thoughts about this piece.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="pb-8 border-b border-[#E8E4DC] last:border-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#C5A46D]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating ? 'fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.title && (
                      <h4 className="font-sans font-bold text-sm text-[#121212] ml-1">
                        {review.title}
                      </h4>
                    )}
                  </div>
                  <span className="text-xs text-[#6E6A64]">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#2A2825] leading-relaxed font-light mb-3">
                  {review.content}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-sans font-semibold text-[#121212] uppercase tracking-wider">
                    {review.author}
                  </span>
                  {review.isVerified && (
                    <span className="flex items-center gap-1 text-[#25D366] font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Review Form */}
        <div className="bg-[#FAF9F6] p-6 sm:p-8 rounded-2xl border border-[#E8E4DC] sticky top-28">
          <h3 className="font-display text-lg uppercase tracking-wide text-[#121212] mb-5">
            Write a Review
          </h3>

          {success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex flex-col items-center text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
              <p className="font-bold">Thank you for your review!</p>
              <p className="mt-1 opacity-80">It will be published shortly.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-4 text-green-700 underline font-semibold text-xs"
              >
                Write another
              </button>
            </div>
          ) : (
            <form action={handleAction} className="space-y-4">
              <input type="hidden" name="productId" value={productId} />
              
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? 'fill-[#C5A46D] text-[#C5A46D]'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="author"
                  required
                  placeholder="How should we call you?"
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                  Review Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Summarize your thoughts"
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                  Review
                </label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  placeholder="What did you love about this piece? How was the fit?"
                  className="w-full px-4 py-3 bg-white border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] resize-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#121212] hover:bg-[#C5A46D] text-white rounded-xl font-sans font-semibold text-sm uppercase tracking-wider transition-colors disabled:opacity-50 mt-2 btn-magnetic"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
