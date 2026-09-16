import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/services';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = (query = '') => {
    setLoading(true);
    productService
      .getAllAdmin({ search: query, limit: 100 })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted');
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-dark-400">Products</h1>
          <p className="text-dark-100 text-sm">{products.length} products total</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary btn-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input pl-9 text-sm" />
        </div>
        <button type="submit" className="btn-secondary btn-sm">Search</button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="card p-4 animate-pulse space-y-3">
          {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-dark-100">
          <p className="text-4xl mb-4">📦</p>
          <p>No products found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="hidden sm:table-cell">Category</th>
                <th>Price</th>
                <th className="hidden md:table-cell">Stock</th>
                <th className="hidden md:table-cell">Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-cream-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                        <img src={getImageUrl(p.images?.[0])} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-dark-400 text-sm truncate max-w-[200px]">{p.name}</p>
                        <p className="text-xs text-dark-100 sm:hidden">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell text-sm text-dark-200">{p.category}</td>
                  <td>
                    <div className="text-sm">
                      {p.salePrice ? (
                        <>
                          <span className="text-brand-500 font-medium">{formatPrice(p.salePrice)}</span>
                          <span className="text-dark-100 line-through text-xs ml-1">{formatPrice(p.price)}</span>
                        </>
                      ) : (
                        <span className="text-dark-400">{formatPrice(p.price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className={`text-sm font-medium ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-orange-500' : 'text-sage-500'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    {p.active ? (
                      <span className="badge badge-sage text-[10px]">Active</span>
                    ) : (
                      <span className="badge bg-red-100 text-red-500 text-[10px]">Inactive</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Link to={`/admin/products/${p._id}/edit`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-all" aria-label="Edit">
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(p._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-dark-400/40 backdrop-blur-sm">
          <div className="card p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-serif text-xl text-dark-400 mb-2">Delete Product?</h3>
            <p className="text-sm text-dark-100 mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost btn-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
