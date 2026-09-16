import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { productService } from '../services/services';
import ProductCard from '../components/products/ProductCard';
import { debounce } from '../utils/helpers';

const CATEGORIES = [
  'All',
  'Crochet Flowers',
  'Crochet Bouquets',
  'Crochet Keychains',
  'Crochet Bags',
  'Crochet Dolls',
  'Custom Crochet',
  'Gifts',
];

const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Name: A-Z', value: 'name' },
];

const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="skeleton aspect-square" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-5 w-24 mt-2" />
      <div className="skeleton h-10 w-full mt-2 rounded-full" />
    </div>
  </div>
);

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;

    productService
      .getAll(params)
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, sort, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page'); // Reset page on filter change
    setSearchParams(params);
  };

  const handleSearchInput = useMemo(
    () =>
      debounce((val) => {
        updateParam('search', val);
      }, 400),
    []
  );

  return (
    <div className="pt-20 sm:pt-24">
      {/* Page Header */}
      <div className="bg-white border-b border-cream-200">
        <div className="container-max section-padding py-8 sm:py-12">
          <nav className="text-sm text-dark-100 mb-3">
            <Link to="/" className="hover:text-brand-500">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-dark-400">Shop</span>
            {category && category !== 'All' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-dark-400">{category}</span>
              </>
            )}
          </nav>
          <h1 className="section-title">
            {category && category !== 'All' ? category : 'All Products'}
          </h1>
          <p className="text-dark-100 mt-2">
            {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
            {search && ` for "${search}"`}
          </p>
        </div>
      </div>

      <div className="container-max section-padding py-6 sm:py-8">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
            <input
              type="text"
              defaultValue={search}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search crochet products..."
              className="input pl-10 pr-4"
            />
          </div>

          <div className="flex gap-3 items-center">
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="input w-auto pr-8 text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="sm:hidden btn-ghost btn-sm"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`flex-shrink-0 w-56 ${
              filtersOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto sm:static sm:bg-transparent sm:p-0' : 'hidden sm:block'
            }`}
          >
            {filtersOpen && (
              <div className="flex justify-between items-center mb-4 sm:hidden">
                <h3 className="font-serif text-lg">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="p-1"><X size={20} /></button>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-dark-400 mb-3">Categories</h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { updateParam('category', cat); setFiltersOpen(false); }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      (cat === 'All' && !category) || category === cat
                        ? 'bg-brand-100 text-brand-600 font-medium'
                        : 'text-dark-200 hover:bg-cream-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {(search || category) && (
              <button
                onClick={() => { setSearchParams({}); setFiltersOpen(false); }}
                className="text-sm text-brand-500 hover:text-brand-700"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-serif text-xl text-dark-400 mb-2">No products found</h3>
                <p className="text-dark-100 mb-4">
                  {search
                    ? `No crochet products found for "${search}"`
                    : 'No products in this category yet'}
                </p>
                <button
                  onClick={() => setSearchParams({})}
                  className="btn-primary btn-sm"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => updateParam('page', String(p))}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                          p === pagination.page
                            ? 'bg-brand-500 text-white shadow-brand'
                            : 'bg-white text-dark-200 hover:bg-cream-200 border border-cream-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
