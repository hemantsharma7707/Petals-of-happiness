import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/services';
import { formatPrice, formatDate, getStatusClass } from '../utils/helpers';
import { Package, ChevronRight } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="section-title mb-8">My Orders</h1>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-24" />
                    <div className="skeleton h-3 w-32" />
                  </div>
                  <div className="skeleton h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="section-title mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-dark-100 mb-4" />
            <h3 className="font-serif text-xl text-dark-400 mb-2">No orders yet</h3>
            <p className="text-dark-100 mb-6">Start shopping to see your orders here</p>
            <Link to="/products" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order-success/${order._id}`}
                className="card p-5 flex items-center gap-4 group hover:shadow-hover transition-all"
              >
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-dark-400 text-sm">#{order.orderId}</span>
                    <span className={`badge ${getStatusClass(order.orderStatus)} text-[10px]`}>{order.orderStatus}</span>
                  </div>
                  <p className="text-xs text-dark-100 mb-2">{formatDate(order.createdAt)}</p>
                  <p className="text-sm text-dark-200 truncate">
                    {order.items?.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                  </p>
                </div>

                {/* Total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-serif font-semibold text-dark-400">{formatPrice(order.total)}</p>
                  <p className="text-xs text-dark-100">{order.items?.length} items</p>
                </div>

                <ChevronRight size={18} className="text-dark-100 group-hover:text-brand-500 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
