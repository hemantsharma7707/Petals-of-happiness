const Product = require('../models/Product.model');
const path = require('path');
const fs = require('fs');

// @route  GET /api/products
// @access Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      featured,
      bestSeller,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { active: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (bestSeller === 'true') query.bestSeller = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/products/:id
// @access Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { slug: req.params.id },
      ],
      active: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      active: true,
    }).limit(4);

    res.json({ success: true, product, related });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/products
// @access Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, price, salePrice, category, stock,
      variants, customizationAvailable, featured, bestSeller, active,
    } = req.body;

    const imageUrls = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : (req.body.images ? JSON.parse(req.body.images) : []);

    const parsedVariants = variants ? JSON.parse(variants) : [];

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      category,
      images: imageUrls,
      stock: Number(stock) || 0,
      variants: parsedVariants,
      customizationAvailable: customizationAvailable === 'true' || customizationAvailable === true,
      featured: featured === 'true' || featured === true,
      bestSeller: bestSeller === 'true' || bestSeller === true,
      active: active !== 'false' && active !== false,
    });

    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/products/:id
// @access Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name, description, price, salePrice, category, stock,
      variants, customizationAvailable, featured, bestSeller, active,
      existingImages,
    } = req.body;

    const newImageUrls = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const keepImages = existingImages ? JSON.parse(existingImages) : product.images;
    const allImages = [...keepImages, ...newImageUrls];

    const parsedVariants = variants ? JSON.parse(variants) : product.variants;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price ? Number(price) : product.price,
        salePrice: salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : product.salePrice,
        category: category || product.category,
        images: allImages,
        stock: stock !== undefined ? Number(stock) : product.stock,
        variants: parsedVariants,
        customizationAvailable: customizationAvailable !== undefined
          ? (customizationAvailable === 'true' || customizationAvailable === true)
          : product.customizationAvailable,
        featured: featured !== undefined ? (featured === 'true' || featured === true) : product.featured,
        bestSeller: bestSeller !== undefined ? (bestSeller === 'true' || bestSeller === true) : product.bestSeller,
        active: active !== undefined ? (active !== 'false' && active !== false) : product.active,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Product updated', product: updated });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/products/:id
// @access Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/admin/products (includes inactive)
// @access Admin
const getAllProductsAdmin = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort('-createdAt').skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAllProductsAdmin };
