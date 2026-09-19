import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/services';
import { formatPrice, getImageUrl, validatePhone, validatePincode } from '../utils/helpers';
import { MapPin, User, Phone, FileText, ChevronLeft, ShoppingBag, X, QrCode, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Dynamic Shipping Calculation
  const calculateShipping = () => {
    if (paymentMethod === 'UPI') return 0;
    if (subtotal > 800) return 0;
    if (form.city.trim().toLowerCase() === 'jaipur') return 50;
    return 100;
  };
  const shippingFee = form.city.trim() ? calculateShipping() : 0;
  const total = subtotal + shippingFee;

  const update = (key, val) => {
    setForm({ ...form, [key]: val });
    if (errors[key]) setErrors({ ...errors, [key]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!validatePhone(form.phone)) errs.phone = 'Enter a valid 10-digit phone number';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required';
    else if (!validatePincode(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrderClick = () => {
    if (items.length === 0) return toast.error('Your cart is empty');
    if (!validate()) return toast.error('Please fix the errors in the form');
    
    if (paymentMethod === 'UPI') {
      setShowPaymentModal(true);
    } else if (paymentMethod === 'COD' && shippingFee > 0) {
      setShowPaymentModal(true);
    } else {
      submitOrder();
    }
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedVariants: item.selectedVariants,
        customization: item.customization,
      }));

      const res = await orderService.create({
        items: orderItems,
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        paymentMethod,
      });

      clearCart();
      toast.success('Order placed successfully! 🌸');
      navigate(`/order-success/${res.data.order._id}`, {
        state: { order: res.data.order, whatsappUrl: res.data.whatsappUrl },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-max px-4 text-center py-20">
          <div className="text-5xl mb-4">🧶</div>
          <h1 className="font-serif text-2xl text-dark-400 mb-2">Your cart is empty</h1>
          <p className="text-dark-100 mb-6">Add some products before checking out</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-6">
          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-brand-700">
            <ChevronLeft size={16} /> Continue Shopping
          </Link>
          <h1 className="section-title mt-2">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="card p-6">
              <h2 className="font-serif text-xl text-dark-400 mb-5 flex items-center gap-2">
                <User size={18} className="text-brand-500" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text" value={form.customerName} onChange={(e) => update('customerName', e.target.value)}
                    className={`input ${errors.customerName ? 'input-error' : ''}`}
                    placeholder="Your full name"
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                    className={`input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="10-digit number" maxLength={10}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="card p-6">
              <h2 className="font-serif text-xl text-dark-400 mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-brand-500" />
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Complete Address *</label>
                  <textarea
                    value={form.address} onChange={(e) => update('address', e.target.value)}
                    className={`input resize-none ${errors.address ? 'input-error' : ''}`}
                    rows={3} placeholder="House/flat number, street, landmark"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className={`input ${errors.city ? 'input-error' : ''}`} placeholder="Your city" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="label">Pincode *</label>
                    <input type="text" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} className={`input ${errors.pincode ? 'input-error' : ''}`} placeholder="6-digit pincode" maxLength={6} />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-serif text-xl text-dark-400 mb-5 flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-500" />
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-3 pb-3 border-b border-cream-200 last:border-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-400 truncate">{item.name}</p>
                      {item.selectedColor && <p className="text-xs text-dark-100">Color: {item.selectedColor}</p>}
                      <p className="text-xs text-dark-100">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-dark-400 flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-100">Subtotal</span>
                  <span className="text-dark-400">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-100">Shipping</span>
                  {form.city.trim() ? (
                    <span className="text-dark-400">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                  ) : (
                    <span className="text-dark-100">Enter city to calculate</span>
                  )}
                </div>
                <div className="flex justify-between pt-3 border-t border-cream-200">
                  <span className="font-semibold text-dark-400">Total</span>
                  <span className="font-serif text-xl font-bold text-brand-500">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Payment Selection */}
              <div className="mt-6 mb-4">
                <h3 className="text-sm font-semibold text-dark-400 mb-3">Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-brand-500 bg-brand-50' : 'border-cream-200 hover:border-cream-300'}`}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-brand-500' : 'border-dark-100'}`}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                    </div>
                    <span className="font-medium text-dark-400 text-sm">Cash on Delivery</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-brand-500 bg-brand-50' : 'border-cream-200 hover:border-cream-300'}`}>
                    <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-brand-500' : 'border-dark-100'}`}>
                      {paymentMethod === 'UPI' && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                    </div>
                    <span className="font-medium text-dark-400 text-sm">UPI Payment</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePlaceOrderClick}
                disabled={loading}
                className="btn-primary w-full justify-center mt-2"
              >
                {loading ? 'Processing...' : '🌸 Place Order'}
              </button>

              <p className="text-xs text-dark-100 text-center mt-3">
                {paymentMethod === 'UPI' ? 'You will be shown a QR code to scan and pay on the next screen.' : 'Pay by cash when the order is delivered to you.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-dark-400/40 backdrop-blur-sm overflow-y-auto py-8">
          <div className="card p-6 max-w-md w-full animate-slide-up my-auto bg-white relative">
            <button 
              onClick={() => setShowPaymentModal(false)} 
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-cream-200"
            >
              <X size={18} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="font-serif text-2xl text-dark-400 mb-2">Complete Payment</h3>
              <p className="text-sm text-dark-200">
                {paymentMethod === 'UPI' ? (
                  <>Please pay <span className="font-bold text-dark-400">{formatPrice(total)}</span> via UPI.</>
                ) : (
                  <>Please pay the delivery charge of <span className="font-bold text-dark-400">{formatPrice(shippingFee)}</span> via UPI to confirm your COD order.</>
                )}
                <br />
                <span className="font-medium text-brand-600">Important:</span> Send a screenshot of the payment to our WhatsApp to confirm your order!
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-brand-50 rounded-xl flex items-center justify-center border-2 border-brand-200">
                <QrCode size={64} className="text-brand-500" />
              </div>
            </div>

            <div className="bg-cream-100 px-4 py-3 rounded-lg border border-cream-200 mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-dark-100 mb-0.5">UPI ID</p>
                <p className="font-medium text-brand-600">hemantjvd@ptyes</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('hemantjvd@ptyes');
                  toast.success('UPI ID copied!');
                }}
                className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
              >
                <Copy size={16} className="text-dark-200" />
              </button>
            </div>

            <button
              onClick={submitOrder}
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3"
            >
              {loading ? 'Placing Order...' : 'I Have Paid & Sent Screenshot'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
