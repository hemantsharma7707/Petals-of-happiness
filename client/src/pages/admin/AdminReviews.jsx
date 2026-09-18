import { useState, useEffect } from 'react';
import { adminService } from '../../services/services';
import { Star, Check, X, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await adminService.getReviews();
      setReviews(res.data.reviews || []);
    } catch (err) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateReviewStatus(id, status);
      toast.success(`Review ${status ? 'approved' : 'hidden'} successfully`);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-dark-200">Loading reviews...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-dark-400 mb-1">Customer Reviews</h1>
          <p className="text-dark-200">Manage and approve product reviews</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto h-12 w-12 text-cream-300 mb-3" />
            <p className="text-dark-200 text-lg">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-50 border-b border-cream-200 text-sm font-medium text-dark-200">
                  <th className="p-4 whitespace-nowrap">Product</th>
                  <th className="p-4 whitespace-nowrap">Customer</th>
                  <th className="p-4 whitespace-nowrap">Rating</th>
                  <th className="p-4 min-w-[300px]">Review</th>
                  <th className="p-4 whitespace-nowrap">Date</th>
                  <th className="p-4 whitespace-nowrap">Status</th>
                  <th className="p-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-4">
                      {review.product ? (
                        <Link to={`/products/${review.product._id}`} className="flex items-center gap-3 group">
                          <img
                            src={review.product.images?.[0] ? `http://localhost:5000/uploads/${review.product.images[0]}` : 'https://placehold.co/100x100?text=No+Image'}
                            alt={review.product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-cream-200"
                          />
                          <div className="text-sm font-medium text-dark-400 group-hover:text-brand-500 flex items-center gap-1">
                            <span className="truncate max-w-[150px]">{review.product.name}</span>
                            <ExternalLink size={14} />
                          </div>
                        </Link>
                      ) : (
                        <span className="text-sm text-dark-100 italic">Deleted Product</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-dark-400">{review.user?.name || 'Unknown'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} fill={star <= review.rating ? 'currentColor' : 'none'} className={star <= review.rating ? 'text-yellow-400' : 'text-cream-300'} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-dark-200 line-clamp-2" title={review.comment}>
                        {review.comment}
                      </p>
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-dark-100">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`badge ${review.isApproved ? 'status-delivered' : 'status-pending'}`}>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right space-x-2">
                      {!review.isApproved ? (
                        <button
                          onClick={() => handleUpdateStatus(review._id, true)}
                          className="btn-secondary py-1.5 px-3 text-xs bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                        >
                          <Check size={14} className="mr-1" /> Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(review._id, false)}
                          className="btn-secondary py-1.5 px-3 text-xs bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                        >
                          <X size={14} className="mr-1" /> Hide
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
