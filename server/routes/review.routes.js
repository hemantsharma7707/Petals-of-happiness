const express = require('express');
const { createReview, getReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Route will be mounted at /api/products/:productId/reviews
router.route('/')
  .post(protect, createReview)
  .get(getReviews);

module.exports = router;
