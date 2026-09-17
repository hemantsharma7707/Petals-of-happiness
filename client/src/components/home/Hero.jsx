import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream-100">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-pattern pointer-events-none" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-100/40 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sage-100/30 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="container-max section-padding relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={14} />
              Handmade with Love ✨
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-dark-400 leading-[1.1] mb-6">
              Crafted with{' '}
              <span className="text-gradient font-italic italic">
                Heart,
              </span>
              <br />
              Made for{' '}
              <span className="text-gradient italic">
                You
              </span>
            </h1>

            <p className="text-dark-200 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              Discover our handmade crochet collection — from eternal rose bouquets to adorable amigurumi dolls. Each piece is crafted stitch by stitch, just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary btn-lg">
                Shop Collection
                <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn-secondary btn-lg">
                Our Story
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-cream-300">
              {[
                { icon: '🌸', text: '100% Handmade' },
                { icon: '🎁', text: 'Gift Ready' },
                { icon: '♻️', text: 'Eco Friendly Yarn' },
                { icon: '❤️', text: 'Made to Order' },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2">
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-sm text-dark-200 font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image Grid */}
          <div className="relative grid grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-4">
              <div className="card overflow-hidden aspect-[3/4] bg-cream-200">
                <img
                  src="https://imgs.search.brave.com/jYXqlaepwQS_MKW4wWdeyEd3ZU_PRPOjv8k1XnvtIpA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jcm9j/aGV0ZWQtcGluay1y/b3NlLWNvbG9yZWQt/Z3Jhbm55LXNxdWFy/ZXMtd2hpdGUtYm9y/ZGVyLWNyb2NoZXQt/aG9vay1pbnNlcnRl/ZC1jb3JuZXItcHJl/dHR5LXBpbmstY3Jv/Y2hldGVkLWdyYW5u/eS00MTQzNjQyNzUu/anBn"
                  alt="Handmade crochet rose bouquet"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="card overflow-hidden aspect-square bg-cream-200">
                <img
                  src="https://imgs.search.brave.com/lvufsfE88j94bkL_LwoKR4lTfLM2AODRt8l87tOkNOk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2I5L2Y2/LzlhL2I5ZjY5YTRi/ZDZiMmNiZDQ4YjA4/NmM3NDQ0MDk5Yjk1/LmpwZw"
                  alt="Crochet keychain"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="card overflow-hidden aspect-square bg-cream-200">
                <img
                  src="https://i.pinimg.com/736x/29/36/61/293661a749536fea45692517ce8055ac.jpg"
                  alt="Crochet teddy bear"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="card overflow-hidden aspect-[3/4] bg-cream-200">
                <img
                  src="https://i.pinimg.com/736x/be/ae/f3/beaef31ad70f373a6c655ea54d85a326.jpg"
                  alt="Crochet tote bag"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-card px-6 py-3 flex items-center gap-3 whitespace-nowrap">
              <div className="flex -space-x-2">
                {['🌸', '🌼', '🌺'].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm border-2 border-white">
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-dark-100">Happy customers</p>
                <p className="text-sm font-semibold text-dark-400">500+ orders ⭐</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
