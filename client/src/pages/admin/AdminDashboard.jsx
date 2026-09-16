import { useState, useEffect } from 'react';
import { adminService } from '../../services/services';
import { formatPrice } from '../../utils/helpers';
import { Package, ShoppingCart, Users, DollarSign, Clock, CheckCircle, Truck } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setStats(res.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { icon: Package, label: 'Total Products', value: stats.totalProducts, color: 'bg-brand-100 text-brand-600' },
        { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-100 text-blue-600' },
        { icon: Clock, label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-yellow-100 text-yellow-600' },
        { icon: CheckCircle, label: 'Confirmed', value: stats.confirmedOrders, color: 'bg-green-100 text-green-600' },
        { icon: Truck, label: 'Delivered', value: stats.deliveredOrders, color: 'bg-purple-100 text-purple-600' },
        { icon: Users, label: 'Total Customers', value: stats.totalCustomers, color: 'bg-sage-100 text-sage-600' },
        { icon: DollarSign, label: 'Revenue', value: formatPrice(stats.revenue), color: 'bg-brand-100 text-brand-700' },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-dark-400">Dashboard</h1>
        <p className="text-dark-100 mt-1">Welcome to Petals of Happiness admin panel 🌸</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(7).fill(0).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="skeleton h-10 w-10 rounded-xl mb-3" />
              <div className="skeleton h-3 w-20 mb-2" />
              <div className="skeleton h-7 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="card p-5 hover:shadow-hover transition-all">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon size={20} />
              </div>
              <p className="text-sm text-dark-100 mb-1">{card.label}</p>
              <p className="font-serif text-2xl font-semibold text-dark-400">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
