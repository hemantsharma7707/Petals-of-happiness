import { Link } from 'react-router-dom';

export default function BrandStory() {
  return (
    <section className="section-padding bg-cream-100 overflow-hidden">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="card overflow-hidden aspect-[4/5] max-w-md mx-auto">
              <img
                src="https://imgs.search.brave.com/R-RXvoT8Umb830onuRJvgd-8I_OZvlBLCcOO3Kau8Hw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcGlt/Zy50aXN0YXRpYy5j/b20vMTIxNTA1NjIv/Yi81L0hhbmRtYWRl/LUNyb2NoZXQtQW1p/Z3VydW1pLUJ1bm55/LUtleWNoYWluLmpw/Zw"
                alt="Handcrafting crochet with love"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 sm:bottom-8 sm:-right-4 bg-brand-500 text-white rounded-2xl p-4 sm:p-6 shadow-brand max-w-[200px]">
              <p className="font-serif text-3xl font-bold">500+</p>
              <p className="text-sm opacity-90">Happy customers and counting 🌸</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="section-tag mb-2">Our Story</p>
            <h2 className="section-title mb-6">
              Every Stitch<br />
              Tells a <span className="text-gradient italic">Story</span>
            </h2>
            <div className="space-y-4 text-dark-200 leading-relaxed">
              <p>
                <strong className="text-dark-400 font-serif">Petals of Happiness</strong> started as a small passion project — creating crochet flowers 
                for friends and family. What began with a single rose bouquet has bloomed into a beloved 
                handmade brand.
              </p>
              <p>
                We believe in slow fashion, in the beauty of imperfection, and in the magic 
                that happens when yarn meets creativity. Every piece takes hours of careful 
                work — and we wouldn't have it any other way.
              </p>
              <p>
                Our mission is simple: to spread happiness, one stitch at a time. Whether 
                it's a birthday bouquet, a baby shower gift, or a little treat for yourself — 
                we pour love into every creation.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 mt-8 pt-6 border-t border-cream-300">
              <div>
                <p className="font-serif text-3xl text-brand-500 font-bold">2+</p>
                <p className="text-sm text-dark-100">Years of crafting</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-brand-500 font-bold">50+</p>
                <p className="text-sm text-dark-100">Unique designs</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-brand-500 font-bold">100%</p>
                <p className="text-sm text-dark-100">Handmade with love</p>
              </div>
            </div>

            <Link to="/about" className="btn-primary mt-8">
              Read More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
