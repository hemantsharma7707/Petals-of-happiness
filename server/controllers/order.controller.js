const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const { getWhatsAppURL } = require('../utils/whatsapp');

// @route  POST /api/orders
// @access Private (customer)
const createOrder = async (req, res, next) => {
  try {
    const { items, customerName, phone, address, city, pincode } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    if (!customerName || !phone || !address || !city || !pincode) {
      return res.status(400).json({ success: false, message: 'Please fill all delivery details' });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian phone number' });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit pincode' });
    }

    // Server-side validate products and calculate total
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }
      if (!product.active) {
        return res.status(400).json({ success: false, message: `Product "${product.name}" is no longer available` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }
      if (item.quantity < 1) {
        return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
      }

      // Use server-calculated effective price
      const effectivePrice = product.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product.price;

      subtotal += effectivePrice * item.quantity;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: effectivePrice,
        quantity: item.quantity,
        selectedColor: item.selectedColor || '',
        selectedVariants: item.selectedVariants || {},
        customization: item.customization || '',
      });

      // Reduce stock
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    const total = subtotal; // No shipping in v1

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      customerName,
      phone,
      address,
      city,
      pincode,
      subtotal,
      total,
      orderStatus: 'Pending',
    });

    // Generate WhatsApp URL
    const whatsappUrl = getWhatsAppURL(order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
      whatsappUrl,
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/orders/my-orders
// @access Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/orders/:id
// @access Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Customers can only see their own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const whatsappUrl = getWhatsAppURL(order);

    res.json({ success: true, order, whatsappUrl });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/admin/orders
// @access Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      orders,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/admin/orders/:id/status
// @access Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    ).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/admin/dashboard
// @access Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const User = require('../models/User.model');

    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      totalCustomers,
      revenueData,
    ] = await Promise.all([
      require('../models/Product.model').countDocuments({ active: true }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Confirmed' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { orderStatus: { $in: ['Confirmed', 'Processing', 'Ready', 'Shipped', 'Delivered'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalCustomers,
        revenue: revenueData[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/admin/users
// @access Admin
const getAllUsers = async (req, res, next) => {
  try {
    const User = require('../models/User.model');
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    // Aggregate order stats per user
    const userIds = users.map((u) => u._id);
    const orderStats = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' },
        },
      },
    ]);

    const statsMap = {};
    orderStats.forEach((s) => { statsMap[s._id.toString()] = s; });

    const usersWithStats = users.map((u) => ({
      ...u.toObject(),
      orderCount: statsMap[u._id.toString()]?.orderCount || 0,
      totalSpent: statsMap[u._id.toString()]?.totalSpent || 0,
    }));

    res.json({
      success: true,
      users: usersWithStats,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getAllUsers,
};
