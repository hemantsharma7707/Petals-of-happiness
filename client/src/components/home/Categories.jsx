import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Crochet Bouquets', emoji: '💐', desc: 'Everlasting floral arrangements', img: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400', color: 'bg-brand-100' },
  { name: 'Crochet Flowers', emoji: '🌸', desc: 'Individual blooms & accessories', img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=400', color: 'bg-sage-100' },
  { name: 'Crochet Keychains', emoji: '🗝️', desc: 'Adorable bag & key charms', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', color: 'bg-cream-200' },
  { name: 'Crochet Dolls', emoji: '🧸', desc: 'Amigurumi friends for all ages', img: 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400', color: 'bg-brand-100' },
  { name: 'Crochet Bags', emoji: '👜', desc: 'Functional boho totes & pouches', img: 'https://images.unsplash.com/photo-1614521084980-d60b0b2a6a53?w=400', color: 'bg-sage-100' },
  { name: 'Gifts', emoji: '🎁', desc: 'Curated gift hampers & sets', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400', color: 'bg-cream-200' },
];

export default function Categories() {
  return (
    <section className="section-padding bg-cream-100">
      <div className="container-max">
        <div className="text-center mb-10">
          <p className="section-tag mb-2">Collections</p>
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-dark-100 mt-3 max-w-lg mx-auto">
            From delicate flowers to cozy totes — find the perfect handmade piece for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white hover:shadow-card transition-all duration-300"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${cat.color} overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="font-medium text-dark-400 text-xs sm:text-sm leading-tight">{cat.name.replace('Crochet ', '')}</p>
                <p className="text-dark-100 text-[10px] sm:text-xs mt-0.5 hidden sm:block">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
