import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/services';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, Clock, CheckCircle, Truck, TrendingUp, AlertTriangle, BarChart3, PieChart } from 'lucide-react';

// Simple mini bar chart component (no library needed)
function MiniBarChart({ data, dataKey, labelKey, color = '#C9856F', height = 200 }) {
  const max = Math.max(...data.map((d) => d[dataKey]), 1);
  return (
    <div className="flex items-end gap-2 justify-between" style={{ height }}>
      {data.map((item, i) => {
        const barHeight = (item[dataKey] / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-dark-100 font-medium">
              {item[dataKey] > 0 ? formatPrice(item[dataKey]) : ''}
            </span>
            <div className="w-full relative group">
              <div
                className="w-full rounded-t-lg transition-all duration-500 ease-out hover:opacity-80"
                style={{
                  height: `${Math.max(barHeight, 4)}%`,
                  backgroundColor: color,
                  minHeight: '4px',
                }}
              />
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-dark-400 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                {item.orders} orders
              </div>
            </div>
            <span className="text-xs text-dark-100 font-medium">{item[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

// Simple donut chart using CSS conic-gradient
function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return <p className="text-dark-100 text-sm text-center py-8">No orders yet</p>;

  const colors = {
    Pending: '#F59E0B',
    Confirmed: '#3B82F6',
    Processing: '#8B5CF6',
    Ready: '#6366F1',
    Shipped: '#F97316',
    Delivered: '#22C55E',
    Cancelled: '#EF4444',
  };

  let accumulated = 0;
  const segments = data.map((d) => {
    const start = accumulated;
    const percentage = (d.count / total) * 100;
    accumulated += percentage;
    return { ...d, start, percentage, color: colors[d.status] || '#9CA3AF' };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start}% ${s.start + s.percentage}%`)
    .join(', ');

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div
          className="w-40 h-40 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
          <span className="font-serif text-2xl font-bold text-dark-400">{total}</span>
          <span className="text-xs text-dark-100">orders</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {segments.map((s) => (
          <div key={s.status} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-dark-200">{s.status}</span>
            <span className="text-dark-100 font-medium">({s.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Horizontal bar chart for top products
function TopProductsChart({ data }) {
  if (data.length === 0) return <p className="text-dark-100 text-sm text-center py-8">No sales data yet</p>;
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-dark-400 font-medium truncate flex-1 mr-4">{item._id}</span>
            <span className="text-xs text-dark-100 flex-shrink-0">{formatPrice(item.revenue)} · {item.unitsSold} sold</span>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(item.revenue / max) * 100}%`,
                backgroundColor: ['#C9856F', '#8BA888', '#D88877', '#B5705A', '#9BBB9A'][i],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => {
        setStats(res.data.stats);
        setCharts(res.data.charts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
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
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(7).fill(0).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="skeleton h-10 w-10 rounded-xl mb-3" />
                <div className="skeleton h-3 w-20 mb-2" />
                <div className="skeleton h-7 w-16" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6 animate-pulse">
              <div className="skeleton h-5 w-40 mb-6" />
              <div className="skeleton h-48 w-full rounded-xl" />
            </div>
            <div className="card p-6 animate-pulse">
              <div className="skeleton h-5 w-40 mb-6" />
              <div className="skeleton h-48 w-48 rounded-full mx-auto" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="card p-5 hover:shadow-hover transition-all">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon size={20} />
                </div>
                <p className="text-sm text-dark-100 mb-1">{card.label}</p>
                <p className="font-serif text-2xl font-semibold text-dark-400">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          {charts && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-brand-500" />
                      <h2 className="font-serif text-lg text-dark-400">Revenue Trend</h2>
                    </div>
                    <span className="badge badge-brand text-xs">Last 6 months</span>
                  </div>
                  <MiniBarChart
                    data={charts.revenueChart}
                    dataKey="revenue"
                    labelKey="month"
                    height={200}
                  />
                </div>

                {/* Orders by Status Donut */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <PieChart size={18} className="text-brand-500" />
                    <h2 className="font-serif text-lg text-dark-400">Orders by Status</h2>
                  </div>
                  <DonutChart data={charts.statusChart} />
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 size={18} className="text-brand-500" />
                    <h2 className="font-serif text-lg text-dark-400">Top Products</h2>
                  </div>
                  <TopProductsChart data={charts.topProducts} />
                </div>

                {/* Low Stock Alert */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <AlertTriangle size={18} className="text-orange-500" />
                    <h2 className="font-serif text-lg text-dark-400">Low Stock Alert</h2>
                  </div>
                  {charts.lowStockProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle size={32} className="mx-auto text-sage-400 mb-2" />
                      <p className="text-dark-100 text-sm">All products are well-stocked! 🎉</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {charts.lowStockProducts.map((product) => (
                        <Link
                          key={product._id}
                          to={`/admin/products/${product._id}/edit`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-100 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-cream-200 overflow-hidden flex-shrink-0">
                            {product.images?.[0] && (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-dark-400 font-medium truncate group-hover:text-brand-500 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-dark-100">{product.category}</p>
                          </div>
                          <span className={`badge text-xs ${
                            product.stock === 0 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-orange-100 text-orange-600'
                          }`}>
                            {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
