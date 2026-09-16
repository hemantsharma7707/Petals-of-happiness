import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-20 sm:pt-24">
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="text-center mb-12">
            <p className="section-tag mb-2">Get In Touch</p>
            <h1 className="section-title">We'd Love to Hear From You</h1>
            <p className="text-dark-100 mt-3 max-w-lg mx-auto">
              Have a custom order request? Want to know more about our products? Reach out to us!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: MessageCircle, title: 'WhatsApp', desc: 'Order and chat directly', action: 'Message Us', color: 'bg-green-100 text-green-600' },
              { icon: Mail, title: 'Email', desc: 'hello@petalsofhappiness.in', action: 'Send Email', color: 'bg-brand-100 text-brand-600' },
              { icon: MapPin, title: 'Location', desc: 'Handmade in India 🇮🇳', action: 'We ship pan-India', color: 'bg-sage-100 text-sage-600' },
            ].map((c) => (
              <div key={c.title} className="card p-6 text-center hover:shadow-hover transition-all">
                <div className={`w-12 h-12 rounded-full ${c.color} flex items-center justify-center mx-auto mb-4`}>
                  <c.icon size={22} />
                </div>
                <h3 className="font-serif text-lg text-dark-400 mb-1">{c.title}</h3>
                <p className="text-sm text-dark-100 mb-2">{c.desc}</p>
                <p className="text-sm font-medium text-brand-500">{c.action}</p>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="card p-8 text-center bg-cream-50 border border-cream-200">
            <h2 className="font-serif text-2xl text-dark-400 mb-4">Custom Orders Welcome! 🌸</h2>
            <p className="text-dark-200 max-w-lg mx-auto leading-relaxed mb-6">
              Want a unique crochet creation? We love making custom pieces! Whether it's a specific color combination,
              a personalized gift, or a completely new design — just tell us your vision and we'll bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/918000217707?text=${encodeURIComponent('Hi! I am interested in a custom crochet order from Petals of Happiness 🌸')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-all"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
              <a
                href="mailto:hello@petalsofhappiness.in"
                className="btn-secondary"
              >
                <Mail size={18} />
                Send Email
              </a>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="font-serif text-2xl text-dark-400 text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { q: 'How long does it take to receive my order?', a: 'Each piece is made to order and takes 3-7 days to create. Shipping typically takes an additional 3-5 business days.' },
                { q: 'Can I customize the colors?', a: 'Yes! Most of our products are available in multiple colors. You can also request custom color combinations.' },
                { q: 'Do you ship all over India?', a: 'Yes, we ship pan-India! Shipping charges are calculated based on your location and discussed via WhatsApp.' },
                { q: 'How do I place an order?', a: 'Simply add products to your cart, fill in your details at checkout, and place your order. A WhatsApp message will be prepared for final confirmation.' },
                { q: 'Can I return or exchange a product?', a: 'Since each piece is handmade to order, we do not accept returns. However, if there is any damage during shipping, please contact us within 24 hours.' },
              ].map((faq, i) => (
                <div key={i} className="card p-5">
                  <h3 className="font-medium text-dark-400 mb-2">{faq.q}</h3>
                  <p className="text-sm text-dark-100">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
