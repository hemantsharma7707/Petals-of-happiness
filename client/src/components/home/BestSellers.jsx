import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { productService } from '../../services/services';
import ProductCard from '../products/ProductCard';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getAll({ bestSeller: true, limit: 4 })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="section-padding bg-cream-50">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-brand-500" />
              <p className="section-tag">Best Sellers</p>
            </div>
            <h2 className="section-title">Most Loved Pieces</h2>
          </div>
          <Link to="/products?sort=bestSeller" className="btn-secondary btn-sm flex-shrink-0">
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-8 w-full mt-3" />
                  </div>
                </div>
              ))
            : products.map((p) => <ProductCard key={p._id} product={p} />)
          }
        </div>
      </div>
    </section>
  );
}
