import { Router } from 'express';
import { cartManager } from '../instances.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProduct(cid, pid);
    res.json(cart);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;