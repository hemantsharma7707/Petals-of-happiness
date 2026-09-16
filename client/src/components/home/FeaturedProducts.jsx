import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/services';
import ProductCard from '../products/ProductCard';

const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="skeleton aspect-square" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-3 w-16" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
      <div className="skeleton h-8 w-full mt-4" />
    </div>
  </div>
);

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getAll({ featured: true, limit: 4 })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-tag mb-2">Featured</p>
            <h2 className="section-title">Our Beloved Creations</h2>
            <p className="text-dark-100 mt-3 max-w-xl">
              Each piece is handcrafted with premium cotton yarn and finished with care.
              The perfect gift — for someone special or yourself!
            </p>
          </div>
          <Link to="/products" className="btn-secondary btn-sm flex-shrink-0">
            View All
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p) => <ProductCard key={p._id} product={p} />)
          }
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-16 text-dark-100">
            <p className="text-4xl mb-4">🧶</p>
            <p>Products coming soon...</p>
          </div>
        )}
      </div>
    </section>
  );
}
