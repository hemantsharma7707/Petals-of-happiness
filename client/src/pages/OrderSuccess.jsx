import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Check, MessageCircle, ShoppingBag, ArrowRight, Copy } from 'lucide-react';
import { orderService } from '../services/services';
import { formatPrice, formatDate, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [whatsappUrl, setWhatsappUrl] = useState(location.state?.whatsappUrl || '');
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      setLoading(true);
      orderService
        .getById(id)
        .then((res) => {
          setOrder(res.data.order);
          setWhatsappUrl(res.data.whatsappUrl || '');
        })
        .catch(() => toast.error('Order not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Auto-open WhatsApp on first load
  useEffect(() => {
    if (whatsappUrl && location.state?.order) {
      const timer = setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [whatsappUrl]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-24 pb-16 text-center">
        <p className="text-dark-100">Order not found</p>
        <Link to="/" className="btn-primary mt-4">Go Home</Link>
      </div>
    );
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    toast.success('Order ID copied!');
  };

  return (
    <div className="pt-20 sm:pt-24 pb-16 bg-cream-100 min-h-screen">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl py-8">
        {/* Success Banner */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-green-500" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-dark-400 mb-2">
            Order Placed Successfully! 🌸
          </h1>
          <p className="text-dark-100 text-lg">Thank you for choosing Petals of Happiness</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="badge badge-brand text-base px-4 py-1.5">#{order.orderId}</span>
            <button onClick={copyOrderId} className="p-1.5 hover:bg-cream-200 rounded-lg transition-all" aria-label="Copy order ID">
              <Copy size={14} className="text-dark-100" />
            </button>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="card p-6 mb-6 border-2 border-green-200 bg-green-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-dark-400 mb-1">Confirm via WhatsApp</h3>
              <p className="text-sm text-dark-200 mb-3">
                Your order details have been prepared. Click below to send the order summary to our WhatsApp for final confirmation.
              </p>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-all active:scale-95"
                >
                  <MessageCircle size={18} />
                  Open WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 mb-6">
          <h2 className="font-serif text-xl text-dark-400 mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-cream-200 last:border-0">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-400 text-sm">{item.name}</p>
                  {item.selectedColor && <p className="text-xs text-dark-100">Color: {item.selectedColor}</p>}
                  <p className="text-xs text-dark-100">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-dark-400 text-sm">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-cream-200 pt-3 flex justify-between">
            <span className="font-semibold text-dark-400">Total</span>
            <span className="font-serif text-xl font-bold text-brand-500">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="card p-6 mb-6">
          <h2 className="font-serif text-xl text-dark-400 mb-4">Delivery Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-dark-100 text-xs">Customer</p>
              <p className="text-dark-400 font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-dark-100 text-xs">Phone</p>
              <p className="text-dark-400 font-medium">{order.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-dark-100 text-xs">Address</p>
              <p className="text-dark-400 font-medium">{order.address}, {order.city} - {order.pincode}</p>
            </div>
            <div>
              <p className="text-dark-100 text-xs">Order Status</p>
              <span className="badge status-pending mt-1">{order.orderStatus}</span>
            </div>
            <div>
              <p className="text-dark-100 text-xs">Order Date</p>
              <p className="text-dark-400 font-medium">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-orders" className="btn-secondary justify-center">
            <ShoppingBag size={18} />
            View My Orders
          </Link>
          <Link to="/products" className="btn-primary justify-center">
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
