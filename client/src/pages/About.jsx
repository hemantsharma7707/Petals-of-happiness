import { Link } from 'react-router-dom';
import { Heart, Leaf, Gift, Star, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-20 sm:pt-24">
      {/* Hero */}
      <section className="section-padding bg-white">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-tag mb-2">Our Story</p>
            <h1 className="section-title mb-6">
              Where Yarn Meets <span className="text-gradient italic">Heart</span>
            </h1>
            <div className="space-y-4 text-dark-200 leading-relaxed">
              <p>
                <strong className="text-dark-400">Petals of Happiness</strong> began with a simple idea — to create beautiful, 
                meaningful handmade gifts that last forever. Unlike real flowers that wilt, our crochet 
                creations are timeless keepsakes that preserve your precious moments.
              </p>
              <p>
                Every single product in our store is handcrafted with love, using premium cotton yarn 
                and countless hours of meticulous work. From delicate rose bouquets to adorable amigurumi 
                dolls, each piece carries the warmth of a human touch.
              </p>
              <p>
                We believe that the best gifts come from the heart — and nothing says "I care" quite 
                like a handmade creation made just for you.
              </p>
            </div>
            <Link to="/products" className="btn-primary mt-6">
              Explore Our Collection <ArrowRight size={18} />
            </Link>
          </div>
          <div className="card overflow-hidden aspect-[4/5] max-w-md mx-auto lg:mx-0">
            <img
              src="https://imgs.search.brave.com/rD6g-F1c2gxGRgvzgqoM6Sco11Cbs9CsAJnALI1oaR8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNzU4/NTU3MC9wZXhlbHMt/cGhvdG8tNzU4NTU3/MC5qcGVnP2NzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw"
              alt="Handcrafted crochet art"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-cream-100">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="section-title">What We Believe In</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Made with Love', desc: 'Every stitch carries our passion and care.' },
              { icon: Leaf, title: 'Eco-Friendly', desc: 'Natural cotton yarn, kind to skin and planet.' },
              { icon: Gift, title: 'Gift-Ready', desc: 'Beautiful packaging included with every order.' },
              { icon: Star, title: 'Premium Quality', desc: 'Durable, soft, and designed to last forever.' },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center hover:shadow-hover transition-all">
                <v.icon size={32} className="text-brand-500 mx-auto mb-4" />
                <h3 className="font-serif text-lg text-dark-400 mb-2">{v.title}</h3>
                <p className="text-sm text-dark-100">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-500 text-white text-center">
        <div className="container-max">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">Ready to Order?</h2>
          <p className="text-brand-100 mb-6 max-w-md mx-auto">
            Browse our collection and find the perfect handmade gift.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-500 font-semibold rounded-full hover:shadow-card transition-all">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
