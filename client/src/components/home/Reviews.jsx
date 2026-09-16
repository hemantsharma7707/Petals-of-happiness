import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Priya Sharma',
    text: 'The rose bouquet I ordered for my mom\'s birthday was absolutely stunning! She thought they were real flowers at first. The quality and attention to detail is incredible. 🌸',
    rating: 5,
    product: 'Eternal Rose Bouquet',
  },
  {
    name: 'Anita Mehta',
    text: 'I ordered custom keychains for my bridal party and they were perfect! Loved the colors and each one was slightly unique which made them extra special.',
    rating: 5,
    product: 'Custom Name Keychain',
  },
  {
    name: 'Rahul Verma',
    text: 'Got the amigurumi bunny for my daughter and she hasn\'t put it down since! Beautifully made and so soft. Will definitely order more gifts from here.',
    rating: 5,
    product: 'Amigurumi Bunny Doll',
  },
  {
    name: 'Sneha Patel',
    text: 'The gift hamper was such a hit! Everything was beautifully packaged and the card was a lovely touch. Best handmade gift shop in India!',
    rating: 5,
    product: 'Luxury Gift Hamper',
  },
];

export default function Reviews() {
  return (
    <section className="section-padding bg-cream-50">
      <div className="container-max">
        <div className="text-center mb-10">
          <p className="section-tag mb-2">Love Letters</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((r, i) => (
            <div key={i} className="card p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array(r.rating).fill(0).map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-dark-200 text-sm leading-relaxed flex-1 mb-4">"{r.text}"</p>

              {/* Author */}
              <div className="border-t border-cream-200 pt-3 mt-auto">
                <p className="font-medium text-dark-400 text-sm">{r.name}</p>
                <p className="text-xs text-brand-500">{r.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
