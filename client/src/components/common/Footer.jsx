import { Link } from 'react-router-dom';
import { Instagram, Facebook, Heart, Mail, Phone, MapPin } from 'lucide-react';

const CATEGORIES = [
  'Crochet Flowers',
  'Crochet Bouquets',
  'Crochet Keychains',
  'Crochet Bags',
  'Crochet Dolls',
  'Custom Crochet',
  'Gifts',
];

export default function Footer() {
  return (
    <footer className="bg-dark-400 text-cream-200">
      {/* Top Section */}
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-brand-400 flex items-center justify-center text-white text-lg">
                🌸
              </div>
              <div>
                <div className="font-serif text-xl font-semibold text-cream-100 leading-tight">Petals of</div>
                <div className="font-accent italic text-brand-300 text-sm leading-none">Happiness</div>
              </div>
            </div>
            <p className="text-dark-100 text-sm leading-relaxed mb-6">
              Handcrafted with love, every stitch tells a story. Our crochet creations bring warmth and joy into your life.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/petals_0f_happiness?stkn=ZDNlZDc0MzIxNw==git " aria-label="Instagram" className="w-9 h-9 rounded-full bg-dark-300 flex items-center justify-center text-cream-200 hover:bg-brand-500 hover:text-white transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-dark-300 flex items-center justify-center text-cream-200 hover:bg-brand-500 hover:text-white transition-all">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-cream-100 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/about', label: 'Our Story' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/my-orders', label: 'Track Order' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-dark-100 text-sm hover:text-brand-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-cream-100 font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-dark-100 text-sm hover:text-brand-300 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-cream-100 font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-brand-400 flex-shrink-0 mt-0.5" />
                <span className="text-dark-100 text-sm">Order via WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-brand-400 flex-shrink-0 mt-0.5" />
                <span className="text-dark-100 text-sm">hello@petalsofhappiness.in</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-brand-400 flex-shrink-0 mt-0.5" />
                <span className="text-dark-100 text-sm">Handmade with love in India 🇮🇳</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-dark-300 rounded-xl">
              <p className="text-sm text-dark-100 mb-1">💌 Made to order</p>
              <p className="text-xs text-dark-100">Every piece is handcrafted just for you. Allow 3–7 days for creation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-300">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-dark-100 text-sm">
            © {new Date().getFullYear()} Petals of Happiness. All rights reserved.
          </p>
          <p className="text-dark-100 text-sm flex items-center gap-1">
            Made with <Heart size={13} className="text-brand-400 fill-brand-400" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
