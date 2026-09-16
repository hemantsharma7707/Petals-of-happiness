require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Product = require('../models/Product.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petals-of-happiness';

const sampleProducts = [
  {
    name: 'Eternal Rose Bouquet',
    description: 'A stunning handcrafted crochet bouquet featuring 7 lifelike roses in your choice of color. Each petal is carefully shaped and textured to mimic the beauty of real roses. Perfect as a lasting gift for anniversaries, birthdays, or just to say "I love you." These roses never wilt! Made with premium cotton yarn, they are hypoallergenic and suitable for all ages.',
    price: 1299,
    salePrice: 999,
    category: 'Crochet Bouquets',
    images: [
      'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600',
      'https://images.unsplash.com/photo-1569494315581-abdbd8616357?w=600',
    ],
    stock: 15,
    variants: [{ name: 'Color', options: ['Pink', 'Red', 'White', 'Purple', 'Yellow', 'Peach'] }],
    customizationAvailable: true,
    featured: true,
    bestSeller: true,
    active: true,
  },
  {
    name: 'Mini Sunflower Keychain',
    description: 'Brighten up your day with this adorable mini sunflower keychain! Handcrafted with soft cotton yarn, this cheerful keychain makes a perfect gift or a cute accessory for your keys, bag, or backpack. Each piece is lovingly made and slightly unique — just like you!',
    price: 299,
    salePrice: null,
    category: 'Crochet Keychains',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    ],
    stock: 50,
    variants: [{ name: 'Color', options: ['Yellow', 'Orange', 'White', 'Pink'] }],
    customizationAvailable: false,
    featured: true,
    bestSeller: true,
    active: true,
  },
  {
    name: 'Boho Tote Bag',
    description: 'Carry your essentials in style with this handcrafted boho crochet tote bag! Made with durable cotton yarn, this spacious bag features an open weave design that is breathable and lightweight. Perfect for beach trips, farmers markets, or everyday use. The sturdy handles are comfortable to carry.',
    price: 1899,
    salePrice: 1599,
    category: 'Crochet Bags',
    images: [
      'https://images.unsplash.com/photo-1614521084980-d60b0b2a6a53?w=600',
    ],
    stock: 8,
    variants: [
      { name: 'Color', options: ['Natural White', 'Caramel', 'Sage Green', 'Dusty Rose'] },
      { name: 'Size', options: ['Small', 'Medium', 'Large'] },
    ],
    customizationAvailable: false,
    featured: true,
    bestSeller: false,
    active: true,
  },
  {
    name: 'Amigurumi Bunny Doll',
    description: 'Meet your new best friend! This adorable handcrafted amigurumi bunny doll is made with premium soft cotton yarn, stuffed with hypoallergenic fiberfill for a perfectly huggable feel. Completely safe for babies and toddlers (no sharp parts). Each bunny comes with her signature bow and is made to order in your choice of color. Makes a wonderful baby shower gift, birthday present, or cherished keepsake.',
    price: 799,
    salePrice: null,
    category: 'Crochet Dolls',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    ],
    stock: 12,
    variants: [{ name: 'Color', options: ['White', 'Pink', 'Grey', 'Brown', 'Lavender'] }],
    customizationAvailable: true,
    featured: true,
    bestSeller: false,
    active: true,
  },
  {
    name: 'Wildflower Mini Bouquet',
    description: 'A charming mix of handcrafted crochet wildflowers — daisies, lavender sprigs, and baby\'s breath arranged in a mini bouquet. These everlasting flowers come wrapped in craft paper and tied with a ribbon, ready to gift. Perfect for desks, bookshelves, or as a heartfelt handmade gift.',
    price: 649,
    salePrice: null,
    category: 'Crochet Bouquets',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=600',
    ],
    stock: 20,
    variants: [{ name: 'Color Theme', options: ['Pastels', 'Vibrant', 'Earthy', 'Monochrome Pink'] }],
    customizationAvailable: true,
    featured: false,
    bestSeller: true,
    active: true,
  },
  {
    name: 'Crochet Flower Hair Clip Set',
    description: 'Add a touch of handmade charm to your hair with this beautiful set of 3 crochet flower hair clips. Each clip features a different flower — a rose, a daisy, and a sunflower — crafted in coordinating colors and attached to sturdy alligator clips. Suitable for all hair types.',
    price: 449,
    salePrice: 399,
    category: 'Crochet Flowers',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
    ],
    stock: 30,
    variants: [{ name: 'Color Set', options: ['Pinks & Whites', 'Yellows & Oranges', 'Purples & Blues', 'Mixed Pastels'] }],
    customizationAvailable: false,
    featured: false,
    bestSeller: true,
    active: true,
  },
  {
    name: 'Custom Name Keychain',
    description: 'Order a completely personalized keychain with your name, initials, or a short word! Each letter is individually crocheted and strung together on a sturdy ring. These make incredibly meaningful gifts — a truly one-of-a-kind creation. Please leave your desired name/word in the customization notes.',
    price: 499,
    salePrice: null,
    category: 'Crochet Keychains',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    ],
    stock: 25,
    variants: [{ name: 'Color', options: ['Pink', 'White', 'Blue', 'Green', 'Yellow', 'Purple', 'Red', 'Mixed'] }],
    customizationAvailable: true,
    featured: false,
    bestSeller: false,
    active: true,
  },
  {
    name: 'Luxury Gift Hamper',
    description: 'Treat someone special to this curated crochet gift hamper! Includes: 1 mini rose bouquet (3 roses), 2 flower keychains, 1 amigurumi mini bear, and 1 crochet hair clip — all beautifully arranged in a gift box with tissue paper and a personalized card. The perfect all-in-one gift for birthdays, anniversaries, or baby showers.',
    price: 1499,
    salePrice: 1299,
    category: 'Gifts',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
    ],
    stock: 5,
    variants: [{ name: 'Color Theme', options: ['Blush Pink', 'Lavender', 'Sunshine Yellow', 'Classic White'] }],
    customizationAvailable: true,
    featured: true,
    bestSeller: false,
    active: true,
  },
  {
    name: 'Crochet Scrunchies Set of 3',
    description: 'Soft, stretchy, and super cute! These handcrafted crochet scrunchies are made from gentle cotton yarn, making them kind to your hair. Each set includes 3 scrunchies in coordinating colors. Perfect for everyday wear or gifting to your bestie.',
    price: 349,
    salePrice: null,
    category: 'Crochet Flowers',
    images: [
      'https://images.unsplash.com/photo-1559308516-d0c1a8c7b8d3?w=600',
    ],
    stock: 40,
    variants: [{ name: 'Color Set', options: ['Pastels Mix', 'Earth Tones', 'Brights', 'Monochrome'] }],
    customizationAvailable: false,
    featured: false,
    bestSeller: false,
    active: true,
  },
  {
    name: 'Crochet Teddy Bear',
    description: 'This classic teddy bear is lovingly handcrafted stitch by stitch with premium soft cotton yarn. Standing approximately 25cm tall, this bear makes a wonderful companion for little ones or a nostalgic gift for adults. Completely customizable — choose your bear\'s color and outfit ribbon color.',
    price: 899,
    salePrice: null,
    category: 'Crochet Dolls',
    images: [
      'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=600',
    ],
    stock: 10,
    variants: [
      { name: 'Color', options: ['Honey Brown', 'Cream', 'Grey', 'Pink', 'White'] },
      { name: 'Ribbon Color', options: ['Red', 'Pink', 'Blue', 'Green', 'Yellow'] },
    ],
    customizationAvailable: true,
    featured: false,
    bestSeller: true,
    active: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@petalsofhappiness.com' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists, skipping admin creation');
    } else {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@petalsofhappiness.com',
        phone: '9999999999',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Admin user created:');
      console.log('   Email: admin@petalsofhappiness.com');
      console.log('   Password: Admin@123');
      console.log('   ⚠️  Please change this password immediately after first login!');
    }

    // Check if products already exist
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log(`ℹ️  ${productCount} products already exist, skipping product seeding`);
      console.log('   Run with --force flag to clear and re-seed products');

      if (process.argv.includes('--force')) {
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');
        for (const prod of sampleProducts) { await Product.create(prod); }
        console.log(`✅ Seeded ${sampleProducts.length} products`);
      }
    } else {
      for (const prod of sampleProducts) { await Product.create(prod); }
      console.log(`✅ Seeded ${sampleProducts.length} sample products`);
    }

    console.log('\n🌸 Database seeding complete!');
    console.log('🚀 You can now start the server: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
