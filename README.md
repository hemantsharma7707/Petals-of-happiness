# 🌸 Petals of Happiness — Handmade Crochet E-Commerce

A complete, production-ready MERN stack e-commerce website for a handmade crochet brand.

![Petals of Happiness](https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800)

## ✨ Features

### Customer Features
- 🏠 Beautiful homepage with hero, featured products, categories, reviews
- 🛍️ Product browsing with search, category filters, sorting, pagination
- 📦 Detailed product pages with variants, colors, customization
- 🛒 Shopping cart with quantity management
- 📝 Checkout with delivery form
- 📱 WhatsApp order confirmation (auto-generates formatted message)
- 📋 Order history and tracking
- 👤 User authentication (register, login, profile)

### Admin Features
- 📊 Dashboard with stats (orders, products, revenue, customers)
- 📦 Full product CRUD (create, edit, delete, images, variants)
- 📋 Order management with status updates
- 👥 Customer management with order stats

### Technical Features
- 🔒 JWT authentication with bcrypt password hashing
- 🛡️ Role-based authorization (customer/admin)
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Premium warm aesthetic (cream, blush, sage)
- ⚡ Server-side order validation and total calculation
- 🗃️ MongoDB with Mongoose models
- 🖼️ Image upload support (local + Cloudinary ready)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### 1. Clone the project

```bash
git clone <your-repo-url>
cd petals-of-happiness
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/petals-of-happiness
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
WHATSAPP_NUMBER=919876543210
```

> ⚠️ **WHATSAPP_NUMBER**: Use country code + number (no + or spaces). Example: `919876543210`

### 3. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Seed the database

This creates an admin account and 10 sample products:

```bash
cd server
npm run seed
```

**Default admin credentials:**
- Email: `admin@petalsofhappiness.com`
- Password: `Admin@123`

> ⚠️ Change the password immediately after first login!

### 5. Start the development servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
Server runs at: http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
Frontend runs at: http://localhost:5173

---

## 📁 Project Structure

```
petals-of-happiness/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Navbar, Footer
│   │   │   ├── products/      # ProductCard
│   │   │   ├── cart/          # CartDrawer
│   │   │   ├── home/          # Hero, FeaturedProducts, Categories, etc.
│   │   │   └── admin/         # Admin components
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── layouts/           # MainLayout, AdminLayout
│   │   ├── pages/             # All page components
│   │   │   └── admin/         # Admin pages
│   │   ├── routes/            # Route guards
│   │   ├── services/          # API service (axios)
│   │   └── utils/             # Helper functions
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                    # Express + MongoDB backend
│   ├── config/                # Database connection
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth, error, upload middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── seed/                  # Database seeding
│   ├── uploads/               # Uploaded images
│   ├── utils/                 # WhatsApp message generator
│   └── server.js              # Entry point
│
├── .gitignore
└── README.md
```

---

## 🔑 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | User | Get profile |
| PUT | `/api/auth/profile` | User | Update profile |
| GET | `/api/products` | Public | List products |
| GET | `/api/products/:id` | Public | Product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/orders` | User | Create order |
| GET | `/api/orders/my-orders` | User | My orders |
| GET | `/api/orders/:id` | User | Order detail |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/admin/orders/:id/status` | Admin | Update order status |
| GET | `/api/admin/users` | Admin | All customers |

---

## 📱 WhatsApp Integration

After order placement:
1. Order is saved in MongoDB with unique ID (POH-XXXX)
2. A formatted WhatsApp message is generated
3. User is redirected to WhatsApp with pre-filled message
4. Business owner receives the complete order details

Configure the WhatsApp number in `server/.env`:
```env
WHATSAPP_NUMBER=919876543210
```

---

## 🏗️ Build for Production

```bash
cd client
npm run build
```

The build output will be in `client/dist/`.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Cream-100 | `#FAF7F2` | Background |
| Brand-500 | `#C9856F` | Primary buttons, accents |
| Brand-700 | `#9B5E52` | Hover states |
| Sage-400 | `#8BA888` | Secondary accent |
| Dark-400 | `#2C1A14` | Text |
| Playfair Display | Serif | Headings |
| Inter | Sans | Body text |

---

## 📝 License

Made with ❤️ for Petals of Happiness 🌸
# Petals-of-happiness
