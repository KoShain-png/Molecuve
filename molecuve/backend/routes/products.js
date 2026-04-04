const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/products — public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/products — admin only
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ msg: 'Name and price are required' });
    }

    const product = new Product({ name, price, category, image });
    await product.save();

    res.status(201).json({ msg: 'Product added', product });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
