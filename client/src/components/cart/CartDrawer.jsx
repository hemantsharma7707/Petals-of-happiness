import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';

export default function CartDrawer() {
  const { items, totalItems, subtotal, updateQuantity, removeItem, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-dark-400/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col bg-cream-50 shadow-hover animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-500" />
            <h2 className="font-serif text-xl text-dark-400">Your Cart</h2>
            {totalItems > 0 && (
              <span className="badge badge-brand">{totalItems} items</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-cream-200 transition-all text-dark-200"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4">🧶</div>
              <h3 className="font-serif text-xl text-dark-400 mb-2">Your cart is empty</h3>
              <p className="text-dark-100 text-sm mb-6">Discover our handmade crochet collection</p>
              <Link
                to="/products"
                onClick={closeCart}
                className="btn-primary btn-sm"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="card p-4 flex gap-3">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-cream-200">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-dark-400 text-sm leading-tight truncate">{item.name}</h4>
                  {item.selectedColor && (
                    <p className="text-xs text-dark-100 mt-0.5">Color: {item.selectedColor}</p>
                  )}
                  {item.customization && (
                    <p className="text-xs text-dark-100 mt-0.5 truncate">Note: {item.customization}</p>
                  )}
                  <p className="text-brand-500 font-semibold text-sm mt-1">{formatPrice(item.price)}</p>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-cream-200 rounded-full px-1">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) updateQuantity(item.key, item.quantity - 1);
                          else removeItem(item.key);
                        }}
                        className="p-1 rounded-full hover:bg-cream-300 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-cream-300 transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 px-6 py-5 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-dark-200 font-medium">Subtotal</span>
              <span className="font-serif text-xl text-dark-400 font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-dark-100 text-center">
              Shipping calculated at checkout • Order via WhatsApp
            </p>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full justify-center"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
            <Link
              to="/products"
              onClick={closeCart}
              className="block text-center text-sm text-brand-500 hover:text-brand-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
