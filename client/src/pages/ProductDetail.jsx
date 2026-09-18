import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Heart, Truck, Shield, ArrowLeft, Check, Star } from 'lucide-react';
import { productService, reviewService } from '../services/services';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import { formatPrice, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [customization, setCustomization] = useState('');

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setSelectedColor('');
    setSelectedVariants({});
    setCustomization('');
    setSelectedImage(0);

    productService
      .getById(id)
      .then((res) => {
        setProduct(res.data.product);
        setRelated(res.data.related || []);
        // Fetch reviews
        reviewService.getByProduct(id).then(r => setReviews(r.data.reviews || []));
        
        // Default color selection
        const colorVariant = res.data.product.variants?.find((v) => v.name.toLowerCase() === 'color');
        if (colorVariant?.options?.length > 0) {
          setSelectedColor(colorVariant.options[0]);
        }
      })
      .catch(() => {
        toast.error('Product not found');
        navigate('/products');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedColor, selectedVariants, customization);
    toast.success(`Added ${quantity}x ${product.name} to cart! 🌸`);
    openCart();
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity, selectedColor, selectedVariants, customization);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return toast.error('Please add a comment');
    setSubmittingReview(true);
    try {
      const res = await reviewService.create(product._id, reviewForm);
      toast.success(res.data.message);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-10 w-3/4" />
              <div className="skeleton h-8 w-32" />
              <div className="skeleton h-20 w-full" />
              <div className="skeleton h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOnSale = product.salePrice && product.salePrice < product.price;
  const effectivePrice = isOnSale ? product.salePrice : product.price;
  const isOutOfStock = product.stock === 0;
  const colorVariant = product.variants?.find((v) => v.name.toLowerCase() === 'color');
  const otherVariants = product.variants?.filter((v) => v.name.toLowerCase() !== 'color') || [];

  return (
    <div className="pt-20 sm:pt-24">
      <div className="container-max section-padding py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-dark-100 mb-6">
          <Link to="/" className="hover:text-brand-500">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-brand-500">Shop</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-500">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-dark-400">{product.name}</span>
        </nav>

        {/* Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="card overflow-hidden aspect-square bg-cream-200 mb-3">
              <img
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === selectedImage ? 'border-brand-500 shadow-brand' : 'border-cream-200 hover:border-brand-300'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              <span className="badge badge-brand">{product.category}</span>
              {product.bestSeller && <span className="badge badge-sage">Best Seller</span>}
              {isOnSale && <span className="badge bg-brand-500 text-white">Sale</span>}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-dark-400 mb-2">{product.name}</h1>

            {/* Rating */}
            {product.numOfReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill={star <= product.averageRating ? 'currentColor' : 'none'} className={star <= product.averageRating ? 'text-yellow-400' : 'text-cream-300'} />
                  ))}
                </div>
                <span className="text-sm text-dark-100">({product.numOfReviews} {product.numOfReviews === 1 ? 'review' : 'reviews'})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif text-3xl text-brand-500 font-bold">{formatPrice(effectivePrice)}</span>
              {isOnSale && (
                <span className="text-lg text-dark-100 line-through">{formatPrice(product.price)}</span>
              )}
              {isOnSale && (
                <span className="badge bg-green-100 text-green-600">
                  Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-dark-200 leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <div className="mb-4">
              {isOutOfStock ? (
                <p className="text-red-500 font-medium">❌ Currently out of stock</p>
              ) : product.stock <= 5 ? (
                <p className="text-orange-500 font-medium">⚡ Only {product.stock} left in stock!</p>
              ) : (
                <p className="text-sage-500 font-medium flex items-center gap-1"><Check size={16} /> In stock</p>
              )}
            </div>

            {/* Color Selector */}
            {colorVariant && colorVariant.options.length > 0 && (
              <div className="mb-5">
                <label className="label">Color: <span className="text-brand-500">{selectedColor}</span></label>
                <div className="flex gap-2 flex-wrap">
                  {colorVariant.options.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${
                        selectedColor === color
                          ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium'
                          : 'border-cream-300 text-dark-200 hover:border-brand-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Other Variants */}
            {otherVariants.map((variant) => (
              <div key={variant.name} className="mb-5">
                <label className="label">{variant.name}</label>
                <div className="flex gap-2 flex-wrap">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants({ ...selectedVariants, [variant.name]: opt })}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${
                        selectedVariants[variant.name] === opt
                          ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium'
                          : 'border-cream-300 text-dark-200 hover:border-brand-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Customization */}
            {product.customizationAvailable && (
              <div className="mb-5">
                <label className="label">✏️ Customization Notes (optional)</label>
                <textarea
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  placeholder="E.g., Add name 'Priya' in pink thread"
                  rows={2}
                  className="input resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-dark-100 mt-1">{customization.length}/200 characters</p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="label">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-cream-200 rounded-full">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="p-3 rounded-full hover:bg-cream-300 transition-all"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                    className="p-3 rounded-full hover:bg-cream-300 transition-all"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-dark-100">{product.stock} available</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn-primary flex-1 justify-center"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn-secondary flex-1 justify-center"
              >
                Buy Now
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-cream-200">
              <div className="flex items-center gap-2 text-sm text-dark-200">
                <Truck size={16} className="text-sage-400" />
                <span>Made to order (3-7 days)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-200">
                <Shield size={16} className="text-sage-400" />
                <span>100% handmade quality</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-200">
                <Heart size={16} className="text-sage-400" />
                <span>Gift-ready packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-12 border-t border-cream-200">
          <h2 className="section-title mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-10 bg-cream-50 rounded-2xl border border-cream-200">
                  <Star size={40} className="mx-auto text-cream-300 mb-3" />
                  <p className="text-dark-200">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="card p-5 border border-cream-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-dark-400">{review.user?.name || 'Customer'}</p>
                        <p className="text-xs text-dark-100">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} fill={star <= review.rating ? 'currentColor' : 'none'} className={star <= review.rating ? 'text-yellow-400' : 'text-cream-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-dark-200 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review */}
            <div>
              <div className="card p-6 bg-brand-50 border border-brand-100 sticky top-24">
                <h3 className="font-serif text-xl text-dark-400 mb-4">Write a Review</h3>
                {!user ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-dark-200 mb-4">You must be logged in to leave a review.</p>
                    <Link to="/login" className="btn-primary w-full justify-center">Log In</Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="label">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star size={24} fill={star <= reviewForm.rating ? '#FBBF24' : 'none'} className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-cream-300'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label">Your Review</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows={4}
                        className="input resize-none"
                        placeholder="What did you like about this product?"
                      />
                    </div>
                    <button type="submit" disabled={submittingReview} className="btn-primary w-full justify-center">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <p className="text-xs text-dark-100 text-center mt-2">Your review will be public after approval.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-cream-200">
            <h2 className="section-title mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
