import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Check, MessageCircle, ShoppingBag, ArrowRight, Copy, ClipboardList, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { orderService } from '../services/services';
import { formatPrice, formatDate, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      setLoading(true);
      orderService
        .getById(id)
        .then((res) => {
          setOrder(res.data.order);
        })
        .catch(() => toast.error('Order not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

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

  // Tracking Timeline Logic
  const trackingSteps = [
    { status: 'Pending', label: 'Order Placed', icon: ClipboardList },
    { status: 'Processing', label: 'Processing', icon: Package, includes: ['Confirmed', 'Processing', 'Ready'] },
    { status: 'Shipped', label: 'Shipped', icon: Truck },
    { status: 'Delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getStepStatus = (stepIndex, currentStatus) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    
    // Find current active step index
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
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl py-8">
        {/* Banner */}
        <div className="text-center mb-10 animate-slide-up">
          {location.state?.order ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={40} className="text-green-500" />
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-dark-400 mb-2">
                Order Placed Successfully! 🌸
              </h1>
              <p className="text-dark-100 text-lg">Thank you for choosing Petals of Happiness</p>
            </>
          ) : (
            <h1 className="font-serif text-3xl sm:text-4xl text-dark-400 mb-2">
              Order Details
            </h1>
          )}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="badge badge-brand text-base px-4 py-1.5">#{order.orderId}</span>
            <button onClick={copyOrderId} className="p-1.5 hover:bg-cream-200 rounded-lg transition-all" aria-label="Copy order ID">
              <Copy size={14} className="text-dark-100" />
            </button>
          </div>
        </div>

        {/* Visual Order Tracking Timeline */}
        <div className="card p-6 mb-6">
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
                style={{ 
                  height: 'var(--progress-height, 0%)',
                  width: 'var(--progress-width, 0%)',
                  // CSS variables to be set based on active step in mobile/desktop
                }}
                ref={(el) => {
                  if (!el) return;
                  let currentStepIndex = 0;
                  if (['Confirmed', 'Processing', 'Ready'].includes(order.orderStatus)) currentStepIndex = 1;
                  if (order.orderStatus === 'Shipped') currentStepIndex = 2;
                  if (order.orderStatus === 'Delivered') currentStepIndex = 3;
                  
                  // For mobile vertical
                  const percentage = currentStepIndex * (100 / 3);
                  if (window.innerWidth < 640) {
                     el.style.height = `${percentage}%`;
                     el.style.width = '2px';
                  } else {
                     el.style.width = `${percentage * 0.8 + 10}%`; // rough approximation for horizontal
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
              <p className="text-dark-100 text-xs">Order Date</p>
              <p className="text-dark-400 font-medium">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-orders" className="btn-secondary justify-center">
            <ShoppingBag size={18} />
            View All Orders
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

