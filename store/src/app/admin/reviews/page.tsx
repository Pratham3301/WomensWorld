import prisma from '@/lib/prisma';
import { toggleReviewVerification, deleteReview } from '@/app/actions/adminReviews';
import { CheckCircle2, XCircle, Trash2, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const rawReviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const productIds = Array.from(new Set(rawReviews.map((r: any) => r.productId as string)));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true }
  });
  
  const productMap = products.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.name }), {} as Record<string, string>);
  
  const reviews = rawReviews.map((r: any) => ({ ...r, productName: productMap[r.productId] || 'Unknown Product' }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-[#121212]">Review Management</h1>
        <p className="text-sm font-sans text-[#6E6A64] mt-1.5 font-light">
          Moderate customer reviews across your products.
        </p>
      </div>

      <div className="bg-white border border-[#E8E4DC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E8E4DC]">
            <thead className="bg-[#FAF9F6]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Review
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E8E4DC]">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-[#6E6A64] font-light">
                    No reviews have been submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 mb-1">
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
                      </div>
                      <div className="text-sm font-sans font-semibold text-[#121212]">
                        {review.title || 'No Title'}
                      </div>
                      <div className="text-sm text-[#6E6A64] font-light line-clamp-2 max-w-sm mt-1">
                        "{review.content}"
                      </div>
                      <div className="text-xs text-[#121212] font-semibold mt-1.5 uppercase tracking-wide">
                        By {review.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#2A2825] max-w-[200px] truncate">
                          {review.productName}
                        </span>
                        <Link 
                          href={`/product/${review.productId}`} 
                          target="_blank"
                          className="text-[#6E6A64] hover:text-[#C5A46D] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                        review.isVerified 
                          ? 'bg-[#25D366]/10 text-[#25D366]' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.isVerified ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Verified</>
                        ) : (
                          <><XCircle className="w-3.5 h-3.5" /> Unverified</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <form action={async () => {
                          'use server';
                          await toggleReviewVerification(review.id, review.isVerified);
                        }}>
                          <button
                            type="submit"
                            className="text-xs font-sans font-bold uppercase tracking-wider text-[#C5A46D] hover:text-[#121212] transition-colors"
                          >
                            {review.isVerified ? 'Revoke' : 'Verify'}
                          </button>
                        </form>
                        <form action={async () => {
                          'use server';
                          await deleteReview(review.id);
                        }}>
                          <button
                            type="submit"
                            className="text-xs font-sans font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
