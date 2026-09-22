import { useState } from 'react';
import { Search, ClipboardList, Package, Truck, CheckCircle, Check, XCircle, AlertCircle } from 'lucide-react';
import { orderService } from '../services/services';
import { formatPrice, formatDate, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) return toast.error('Please enter an Order ID');

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await orderService.trackOrder(trimmed);
      setOrder(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  // Tracking Timeline Logic
  const trackingSteps = [
    { status: 'Pending', label: 'Order Placed', icon: ClipboardList },
    { status: 'Processing', label: 'Processing', icon: Package, includes: ['Confirmed', 'Processing', 'Ready'] },
    { status: 'Shipped', label: 'Shipped', icon: Truck },
    { status: 'Delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getStepStatus = (stepIndex, currentStatus) => {
    if (currentStatus === 'Cancelled') return 'cancelled';

    let currentStepIndex = 0;
    if (['Confirmed', 'Processing', 'Ready'].includes(currentStatus)) currentStepIndex = 1;
    if (currentStatus === 'Shipped') currentStepIndex = 2;
    if (currentStatus === 'Delivered') currentStepIndex = 3;

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="pt-20 sm:pt-24 pb-16 bg-cream-100 min-h-screen">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-brand-500" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-dark-400 mb-2">Track Your Order</h1>
          <p className="text-dark-100">Enter your Order ID to see the latest status of your order.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="card p-5 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Package size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-100" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. POH-1001"
                className="input pl-10 text-sm"
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary px-6 flex-shrink-0">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={16} />
                  Track
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="card p-6 text-center animate-slide-up">
            <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
            <p className="text-dark-400 font-medium mb-1">Order Not Found</p>
            <p className="text-dark-100 text-sm">{error}</p>
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            {/* Order ID & Date */}
            <div className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <div>
                  <p className="text-xs text-dark-100 mb-1">Order ID</p>
                  <span className="badge badge-brand text-base px-4 py-1.5">#{order.orderId}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-dark-100 mb-1">Placed on</p>
                  <p className="text-sm font-medium text-dark-400">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Visual Tracking Timeline */}
            <div className="card p-6">
              <h2 className="font-serif text-xl text-dark-400 mb-6">Order Status</h2>

              {order.orderStatus === 'Cancelled' ? (
                <div className="flex flex-col items-center justify-center py-6 text-red-500 bg-red-50 rounded-xl border border-red-100">
                  <XCircle size={48} className="mb-3" />
                  <h3 className="font-serif text-xl font-medium">Order Cancelled</h3>
                  <p className="text-sm mt-1">This order has been cancelled.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Bar Background */}
                  <div className="absolute left-[1.3rem] sm:left-1/2 sm:-translate-x-1/2 top-4 bottom-4 sm:bottom-auto sm:top-[1.3rem] w-0.5 sm:w-full sm:h-0.5 bg-cream-200 z-0"></div>

                  {/* Progress Bar Active */}
                  <div
                    className="absolute left-[1.3rem] sm:left-[10%] top-4 sm:top-[1.3rem] w-0.5 sm:h-0.5 bg-brand-500 z-0 transition-all duration-500 ease-in-out"
                    ref={(el) => {
                      if (!el) return;
                      let currentStepIndex = 0;
                      if (['Confirmed', 'Processing', 'Ready'].includes(order.orderStatus)) currentStepIndex = 1;
                      if (order.orderStatus === 'Shipped') currentStepIndex = 2;
                      if (order.orderStatus === 'Delivered') currentStepIndex = 3;

                      const percentage = currentStepIndex * (100 / 3);
                      if (window.innerWidth < 640) {
                        el.style.height = `${percentage}%`;
                        el.style.width = '2px';
                      } else {
                        el.style.width = `${percentage * 0.8 + 10}%`;
                        el.style.height = '2px';
                        el.style.left = '10%';
                      }
                    }}
                  ></div>

                  <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                    {trackingSteps.map((step, index) => {
                      const status = getStepStatus(index, order.orderStatus);
                      const Icon = step.icon;

                      return (
                        <div key={index} className="flex sm:flex-col items-center gap-4 sm:gap-3 flex-1">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-colors
                              ${status === 'completed' ? 'bg-brand-500 border-brand-500 text-white' :
                                status === 'active' ? 'bg-white border-brand-500 text-brand-500 shadow-[0_0_15px_rgba(219,39,119,0.3)]' :
                                  'bg-white border-cream-200 text-dark-100'}`}
                          >
                            {status === 'completed' ? <Check size={20} /> : <Icon size={20} />}
                          </div>
                          <div className="sm:text-center">
                            <p className={`font-medium text-sm sm:text-base ${status === 'pending' ? 'text-dark-100' : 'text-dark-400'}`}>
                              {step.label}
                            </p>
                            {status === 'active' && <p className="text-xs text-brand-500 mt-0.5">Current Step</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="card p-6">
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

              <div className="border-t border-cream-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-100">Subtotal</span>
                  <span className="text-dark-400">{formatPrice(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-100">Shipping</span>
                  <span className="text-dark-400">{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee || 0)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-cream-200">
                  <span className="font-semibold text-dark-400">Total</span>
                  <span className="font-serif text-xl font-bold text-brand-500">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="card p-6">
              <h2 className="font-serif text-xl text-dark-400 mb-4">Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-dark-100 text-xs">Customer</p>
                  <p className="text-dark-400 font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-dark-100 text-xs">City</p>
                  <p className="text-dark-400 font-medium">{order.city}</p>
                </div>
                <div>
                  <p className="text-dark-100 text-xs">Order Date</p>
                  <p className="text-dark-400 font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-dark-100 text-xs">Payment</p>
                  <p className="text-dark-400 font-medium">{order.paymentMethod} — {order.paymentStatus}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
