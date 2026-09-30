import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-lg text-center">
        {/* Crochet-themed illustration */}
        <div className="relative mb-8">
          <div className="text-[120px] sm:text-[160px] font-serif font-bold text-brand-200 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl sm:text-7xl animate-bounce-soft">🧶</div>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl text-dark-400 mb-3">
          Oops! This page got tangled up
        </h1>
        <p className="text-dark-100 mb-8 max-w-md mx-auto leading-relaxed">
          Looks like the thread we were following led to a dead end. 
          Don't worry — let's get you back to our cozy collection of handmade crochet goodies!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/products" className="btn-secondary">
            <Search size={18} />
            Browse Products
          </Link>
        </div>

        {/* Decorative petals */}
        <div className="mt-12 flex justify-center gap-3 text-2xl opacity-60">
          <span className="animate-bounce-soft" style={{ animationDelay: '0s' }}>🌸</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.2s' }}>🌷</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.4s' }}>🌺</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.6s' }}>🌼</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.8s' }}>🌸</span>
        </div>
      </div>
    </div>
  );
}
