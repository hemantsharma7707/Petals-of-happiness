import { useState, useEffect } from 'react';
import { adminService } from '../../services/services';
import { formatPrice, formatDate } from '../../utils/helpers';
import { Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = (query = '') => {
    setLoading(true);
    adminService
      .getUsers({ search: query, limit: 100 })
      .then((res) => setUsers(res.data.users || []))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(search); };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users size={24} className="text-brand-500" />
        <h1 className="font-serif text-2xl text-dark-400">Customers</h1>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="input pl-9 text-sm" />
        </div>
        <button type="submit" className="btn-secondary btn-sm">Search</button>
      </form>

      {loading ? (
        <div className="card p-4 animate-pulse space-y-3">
          {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-dark-100">
          <p className="text-4xl mb-4">👥</p>
          <p>No customers found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th className="hidden sm:table-cell">Phone</th>
                <th className="hidden md:table-cell">Registered</th>
                <th>Orders</th>
                <th className="hidden sm:table-cell">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-cream-50 transition-colors">
                  <td>
                    <div>
                      <p className="font-medium text-dark-400 text-sm">{u.name}</p>
                      <p className="text-xs text-dark-100">{u.email}</p>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell text-sm text-dark-200">{u.phone || '—'}</td>
                  <td className="hidden md:table-cell text-sm text-dark-100">{formatDate(u.createdAt)}</td>
                  <td>
                    <span className="badge badge-brand">{u.orderCount}</span>
                  </td>
                  <td className="hidden sm:table-cell text-sm font-medium text-dark-400">
                    {u.totalSpent > 0 ? formatPrice(u.totalSpent) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
