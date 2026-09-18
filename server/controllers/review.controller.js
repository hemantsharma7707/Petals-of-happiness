const Review = require('../models/Review.model');
const Product = require('../models/Product.model');

// @route  POST /api/products/:productId/reviews
// @access Private
const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      rating,
      comment,
      product: productId,
      user: req.user._id,
      isApproved: false, // Needs admin approval
    });

    res.status(201).json({ success: true, message: 'Review submitted and is awaiting approval', review });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/products/:productId/reviews
// @access Public
const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    // Only fetch approved reviews for the public
    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate('user', 'name')
      .sort('-createdAt');

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/admin/reviews
// @access Admin
const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name')
      .populate('product', 'name image')
      .sort('-createdAt');

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/admin/reviews/:id/status
// @access Admin
const updateReviewStatus = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = isApproved;
    await review.save(); // This will trigger calculateAverageRating

    res.json({ success: true, message: 'Review status updated', review });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviews,
  getAllReviewsAdmin,
  updateReviewStatus,
};
