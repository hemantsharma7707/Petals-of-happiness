import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/products?category=Crochet+Bouquets', label: 'Bouquets' },
  { to: '/products?category=Gifts', label: 'Gifts' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { totalItems, openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass shadow-soft border-b border-cream-200' : 'bg-transparent'
        }`}
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-serif text-sm font-bold">
                🌸
              </div>
              <div>
                <div className="font-serif text-lg font-semibold text-dark-400 leading-tight">
                  Petals of
                </div>
                <div className="font-accent italic text-brand-500 text-sm leading-none -mt-0.5">
                  Happiness
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-dark-200 hover:text-brand-500 hover:bg-cream-200'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-dark-200 hover:text-brand-500 hover:bg-cream-200 transition-all"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Profile */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-full text-dark-200 hover:text-brand-500 hover:bg-cream-200 transition-all"
                  aria-label="Account"
                >
                  <User size={20} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card border border-cream-200 py-2 animate-fade-in">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-cream-200">
                          <p className="font-medium text-dark-400 text-sm">{user.name}</p>
                          <p className="text-xs text-dark-100 truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark-200 hover:bg-cream-100 hover:text-brand-500">
                          My Profile
                        </Link>
                        <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark-200 hover:bg-cream-100 hover:text-brand-500">
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brand-500 hover:bg-brand-50 font-medium">
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-cream-200" />
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark-200 hover:bg-cream-100 hover:text-brand-500">
                          Login
                        </Link>
                        <Link to="/register" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark-200 hover:bg-cream-100 hover:text-brand-500">
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-full text-dark-200 hover:text-brand-500 hover:bg-cream-200 transition-all"
                aria-label={`Cart (${totalItems} items)`}
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-soft">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-full text-dark-200 hover:bg-cream-200 transition-all"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden glass border-t border-cream-200 animate-slide-up">
            <nav className="container-max px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-brand-100 text-brand-600' : 'text-dark-200 hover:bg-cream-200'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <hr className="border-cream-300 my-2" />
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm text-dark-200 hover:bg-cream-200">My Profile</Link>
                  <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm text-dark-200 hover:bg-cream-200">My Orders</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-brand-500 hover:bg-brand-50">Admin Panel</Link>}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm text-dark-200 hover:bg-cream-200">Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-brand-500 hover:bg-brand-50">Create Account</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-dark-400/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for crochet products..."
                className="flex-1 px-6 py-4 bg-white rounded-2xl shadow-card text-dark-400 text-lg placeholder-dark-100 border border-cream-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200 outline-none"
              />
              <button type="submit" className="btn-primary px-6 py-4 rounded-2xl text-lg">
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Overlay to close profile dropdown */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
      )}
    </>
  );
}
