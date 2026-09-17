import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Crochet Bouquets', emoji: '💐', desc: 'Everlasting floral arrangements', img: 'https://imgs.search.brave.com/DclEMtZxtj5ESf9g3i6YusXHLetPXwnguea84pOnig4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlYmxvb21jcmFm/dGVyLmNvbS9jZG4v/c2hvcC9maWxlcy8y/MDI0MDYyMzE1MTky/Ml9hMDU4YjZmOC0x/Yjc5LTQ1YjgtYjhh/MS0yZTFjZmYwN2Iy/ZGUuanBnP3Y9MTc3/NTgwNzM5NSZ3aWR0/aD01MzM', color: 'bg-brand-100' },
  { name: 'Crochet Flowers', emoji: '🌸', desc: 'Individual blooms & accessories', img: 'https://imgs.search.brave.com/-Nx6fGDAlnKtz-dQgK-QgRKFa0iPkWf2Xf01kgtMSTg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjUv/ODc0LzQ4Ni9zbWFs/bC9hLWNyb2NoZXRl/ZC1ib3VxdWV0LW9m/LWZsb3dlcnMtaW4t/YS12YXNlLXBob3Rv/LmpwZw', color: 'bg-sage-100' },
  { name: 'Crochet Keychains', emoji: '🗝️', desc: 'Adorable bag & key charms', img: 'https://imgs.search.brave.com/YuG4DaHFtX3Tdu2acRSBECv9mU5NGuDJ9zWEYWC77Hk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFWMlpUSlJvZ0wu/anBn', color: 'bg-cream-200' },
  { name: 'Crochet Dolls', emoji: '🧸', desc: 'Amigurumi friends for all ages', img: 'https://imgs.search.brave.com/0BfcXU_-du6gaeFN1N9t_Irj5y93s13GnK_re74_fZA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzJlLzY5/LzM5LzJlNjkzOWNk/MGE4MTAzOTQzNzhh/ZWU3ZThlZTE0NGE4/LmpwZw', color: 'bg-brand-100' },
  { name: 'Crochet Bags', emoji: '👜', desc: 'Functional boho totes & pouches', img: 'https://imgs.search.brave.com/sVn3FpZ72TE4o1d0wFL3jNDBuP6sW8iuVOWGQnBwyJ8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmxpbmdjdXRlLmNv/bS9jZG4vc2hvcC9w/cm9kdWN0cy9pbF83/OTR4Ti4yNTk3MzM4/MzUyXzh6MjdfMjA0/OHgyMDQ4LmpwZz92/PTE2NDU0Mjc0MjQ', color: 'bg-sage-100' },
  { name: 'Gifts', emoji: '🎁', desc: 'Curated gift hampers & sets', img: 'https://imgs.search.brave.com/aEPxnq4j437KDCdNIpCfpm7Xm9u8DDrWhabCUcKwfpk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbGlz/ZXJvc2Vjcm9jaGV0/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMi8xMS9Tbm93/bWFuZ29vZC53ZWJw', color: 'bg-cream-200' },
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
