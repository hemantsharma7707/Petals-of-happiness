import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-padding bg-brand-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-max relative z-10 text-center">
        <p className="font-accent italic text-brand-100 text-lg mb-3">Something Special Awaits</p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 max-w-2xl mx-auto leading-tight">
          Ready to Gift Happiness?
        </h2>
        <p className="text-brand-100 text-lg max-w-md mx-auto mb-8">
          Browse our handmade crochet collection and find the perfect piece for every occasion.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-500 font-semibold rounded-full hover:bg-cream-100 hover:shadow-card transition-all duration-300 active:scale-95"
          >
            Shop Now
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            Custom Order
          </Link>
        </div>
      </div>
    </section>
  );
}
