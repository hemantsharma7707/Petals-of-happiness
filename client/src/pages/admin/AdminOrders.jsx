import { useState, useEffect } from 'react';
import { orderService } from '../../services/services';
import { formatPrice, formatDate, getStatusClass, getImageUrl } from '../../utils/helpers';
import { Search, Eye, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter !== 'All') params.status = statusFilter;

    orderService
      .getAll(params)
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); fetchOrders(); };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await orderService.updateStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o._id === orderId ? res.data.order : o)));
      if (selectedOrder?._id === orderId) setSelectedOrder(res.data.order);
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-dark-400 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID, name..." className="input pl-9 text-sm" />
          </div>
          <button type="submit" className="btn-secondary btn-sm">Search</button>
        </form>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto text-sm">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card p-4 animate-pulse space-y-3">
          {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-dark-100">
          <p className="text-4xl mb-4">📋</p>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th className="hidden sm:table-cell">Customer</th>
                <th className="hidden md:table-cell">Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-cream-50 transition-colors">
                  <td className="font-medium text-dark-400 text-sm">#{o.orderId}</td>
                  <td className="hidden sm:table-cell">
                    <div>
                      <p className="text-sm text-dark-400">{o.customerName}</p>
                      <p className="text-xs text-dark-100">{o.phone}</p>
                    </div>
                  </td>
                  <td className="hidden md:table-cell text-sm text-dark-100">{formatDate(o.createdAt)}</td>
                  <td className="text-sm font-medium text-dark-400">{formatPrice(o.total)}</td>
                  <td>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      disabled={updatingStatus}
                      className={`badge ${getStatusClass(o.orderStatus)} text-[11px] border-0 cursor-pointer pr-5 font-medium`}
                    >
                      {STATUSES.filter((s) => s !== 'All').map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => setSelectedOrder(o)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-dark-400/40 backdrop-blur-sm overflow-y-auto py-8">
          <div className="card p-6 max-w-lg w-full animate-slide-up my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl text-dark-400">Order #{selectedOrder.orderId}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-cream-200"><X size={18} /></button>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-dark-100 text-xs">Customer</p>
                <p className="text-dark-400 font-medium">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-dark-100 text-xs">Phone</p>
                <p className="text-dark-400 font-medium">{selectedOrder.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-dark-100 text-xs">Address</p>
                <p className="text-dark-400 font-medium">{selectedOrder.address}, {selectedOrder.city} - {selectedOrder.pincode}</p>
              </div>
              <div>
                <p className="text-dark-100 text-xs">Date</p>
                <p className="text-dark-400 font-medium">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-dark-100 text-xs">Status</p>
                <span className={`badge ${getStatusClass(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus}</span>
              </div>
            </div>

            {/* Items */}
            <h4 className="text-sm font-semibold text-dark-400 mb-2">Items</h4>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="flex gap-3 pb-2 border-b border-cream-200 last:border-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                    <img src={getImageUrl(item.image)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-400 truncate">{item.name}</p>
                    {item.selectedColor && <p className="text-xs text-dark-100">Color: {item.selectedColor}</p>}
                    {item.customization && <p className="text-xs text-dark-100">Note: {item.customization}</p>}
                    <p className="text-xs text-dark-100">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="text-sm font-medium text-dark-400 flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-200 pt-3 flex justify-between">
              <span className="font-semibold text-dark-400">Total</span>
              <span className="font-serif text-xl font-bold text-brand-500">{formatPrice(selectedOrder.total)}</span>
            </div>

            {/* Status Update */}
            <div className="mt-4 pt-4 border-t border-cream-200">
              <label className="label">Update Status</label>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                disabled={updatingStatus}
                className="input text-sm"
              >
                {STATUSES.filter((s) => s !== 'All').map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
