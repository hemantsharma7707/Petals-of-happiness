const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  trackOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getAllUsers,
} = require('../controllers/order.controller');
const { getAllProductsAdmin } = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes (no login required)
router.get('/track/:orderId', trackOrder);

// Customer order routes
router.post('/', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes (prefixed with /admin in server.js)
router.get('/admin/dashboard', protect, adminOnly, getDashboardStats);
router.get('/admin/orders', protect, adminOnly, getAllOrders);
router.put('/admin/orders/:id/status', protect, adminOnly, updateOrderStatus);
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.get('/admin/products', protect, adminOnly, getAllProductsAdmin);

module.exports = router;
