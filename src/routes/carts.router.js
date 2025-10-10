const { Router } = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const cm = new CartManager();
const pm = new ProductManager();

router.post('/', async (_req, res, next) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json({ status: 'success', payload: cart });
  } catch (err) { next(err); }
});

router.get('/:cid', async (req, res, next) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
    res.json({ status: 'success', payload: cart.products });
  } catch (err) { next(err); }
});

router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const qty = Number(req.body?.quantity) || 1;

  const product = await pm.getById(pid);
  if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });

    const cart = await cm.addProduct(cid, pid, qty);
    res.status(201).json({ status: 'success', payload: cart });
  } catch (err) { next(err); }
});

module.exports = router;