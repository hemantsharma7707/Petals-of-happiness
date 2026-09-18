require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

// Connect to DB
connectDB();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Admin routes (mapped from order/product controllers)
const { protect, adminOnly } = require('./middleware/auth.middleware');
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
} = require('./controllers/order.controller');
const { getAllProductsAdmin } = require('./controllers/product.controller');
const { getAllReviewsAdmin, updateReviewStatus } = require('./controllers/review.controller');

app.get('/api/admin/dashboard', protect, adminOnly, getDashboardStats);
app.get('/api/admin/orders', protect, adminOnly, getAllOrders);
app.put('/api/admin/orders/:id/status', protect, adminOnly, updateOrderStatus);
app.get('/api/admin/users', protect, adminOnly, getAllUsers);
app.get('/api/admin/products', protect, adminOnly, getAllProductsAdmin);
app.get('/api/admin/reviews', protect, adminOnly, getAllReviewsAdmin);
app.put('/api/admin/reviews/:id/status', protect, adminOnly, updateReviewStatus);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Petals of Happiness API is running 🌸', env: process.env.NODE_ENV });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌸 Petals of Happiness server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});

module.exports = app;
