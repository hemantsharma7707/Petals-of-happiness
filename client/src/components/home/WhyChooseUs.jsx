const FEATURES = [
  {
    icon: '🧶',
    title: 'Truly Handmade',
    desc: 'Every single stitch is lovingly crafted by hand using premium cotton yarn. No machines, no shortcuts — just pure handmade art.',
  },
  {
    icon: '🎨',
    title: 'Fully Customizable',
    desc: 'Choose your colors, add personal notes, or request a completely custom piece. Your vision, our craft.',
  },
  {
    icon: '🌿',
    title: 'Eco-Friendly Yarn',
    desc: 'We use natural cotton yarn that is soft on skin, hypoallergenic, and kind to the planet.',
  },
  {
    icon: '📦',
    title: 'Gift-Ready Packaging',
    desc: 'Every order ships beautifully packaged with tissue paper, a ribbon, and a handwritten card.',
  },
  {
    icon: '✨',
    title: 'Made to Order',
    desc: 'Each piece is created fresh for you — meaning no two are exactly alike. Allow 3–7 days for creation.',
  },
  {
    icon: '💬',
    title: 'WhatsApp Ordering',
    desc: 'Place your order and stay in touch via WhatsApp for updates, customization, and delivery status.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="section-tag mb-2">Why Choose Us</p>
          <h2 className="section-title">Handmade Just for You</h2>
          <p className="text-dark-100 mt-3 max-w-lg mx-auto">
            We believe in creating more than products — we create memories, emotions, and moments of pure joy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-cream-50 hover:bg-brand-50 border border-cream-200 hover:border-brand-200 transition-all duration-300 hover:shadow-soft"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-serif text-xl text-dark-400 mb-2">{f.title}</h3>
              <p className="text-dark-100 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
