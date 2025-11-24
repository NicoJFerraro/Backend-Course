import { Router } from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

const router = Router();

// Create cart
router.post('/', async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Get cart with populated products
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Add product to cart (POST /api/carts/:cid/products/:pid)
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', error: 'Product not found' });
    const idx = cart.products.findIndex(p => p.product.toString() === pid);
    if (idx === -1) cart.products.push({ product: pid, quantity });
    else cart.products[idx].quantity += quantity;
    await cart.save();
    const populated = await Cart.findById(cid).populate('products.product').lean();
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// DELETE /api/carts/:cid/products/:pid -> remove specific product
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success', message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// PUT /api/carts/:cid -> replace all products with body array
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const incoming = Array.isArray(req.body) ? req.body : req.body.products;
    if (!Array.isArray(incoming)) return res.status(400).json({ status: 'error', error: 'Body must be an array of products' });
    // Validate product ids
    for (const item of incoming) {
      if (!item.product) return res.status(400).json({ status: 'error', error: 'Each item needs product field' });
      const exists = await Product.findById(item.product);
      if (!exists) return res.status(400).json({ status: 'error', error: `Invalid product id ${item.product}` });
    }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    cart.products = incoming.map(i => ({ product: i.product, quantity: i.quantity || 1 }));
    await cart.save();
    const populated = await Cart.findById(cid).populate('products.product').lean();
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid -> update quantity only
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const q = parseInt(quantity);
    if (isNaN(q) || q < 1) return res.status(400).json({ status: 'error', error: 'Quantity must be positive integer' });
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    const idx = cart.products.findIndex(p => p.product.toString() === pid);
    if (idx === -1) return res.status(404).json({ status: 'error', error: 'Product not in cart' });
    cart.products[idx].quantity = q;
    await cart.save();
    res.json({ status: 'success', message: 'Quantity updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// DELETE /api/carts/:cid -> empty cart
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'Cart emptied' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;