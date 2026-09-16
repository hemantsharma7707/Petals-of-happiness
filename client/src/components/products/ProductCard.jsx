import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, getImageUrl, truncate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem, openCart } = useCart();

  const isOnSale = product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    toast.success(`${product.name} added to cart! 🌸`);
    openCart();
  };

  return (
    <div className="card card-hover group relative flex flex-col">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block overflow-hidden aspect-square bg-cream-200">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOnSale && (
            <span className="badge bg-brand-500 text-white text-[10px] px-2 py-0.5">SALE</span>
          )}
          {product.bestSeller && (
            <span className="badge bg-sage-400 text-white text-[10px] px-2 py-0.5">BEST SELLER</span>
          )}
          {isOutOfStock && (
            <span className="badge bg-dark-200 text-white text-[10px] px-2 py-0.5">SOLD OUT</span>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-dark-400/0 group-hover:bg-dark-400/10 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Link
            to={`/products/${product._id}`}
            className="p-2.5 bg-white rounded-full shadow-card hover:bg-cream-100 transition-all"
            aria-label="View product"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={16} className="text-dark-400" />
          </Link>
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-brand-500 rounded-full shadow-card hover:bg-brand-700 transition-all"
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} className="text-white" />
            </button>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-brand-500 font-medium mb-1">{product.category}</p>
        <Link
          to={`/products/${product._id}`}
          className="font-serif text-dark-400 font-medium leading-snug hover:text-brand-600 transition-colors mb-2 line-clamp-2"
        >
          {product.name}
        </Link>

        <p className="text-dark-100 text-xs leading-relaxed mb-3 flex-1">
          {truncate(product.description, 70)}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {isOnSale ? (
            <>
              <span className="font-serif font-semibold text-brand-500 text-lg">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-dark-100 line-through text-sm">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-serif font-semibold text-dark-400 text-lg">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {!isOutOfStock && product.stock <= 5 && (
          <p className="text-xs text-orange-500 mb-2">⚡ Only {product.stock} left!</p>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`btn-primary btn-sm w-full justify-center ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ShoppingBag size={15} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
