import { Router } from 'express';
import { productManager } from '../instances.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getAll();
    const result = limit ? products.slice(0, parseInt(limit)) : products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getById(pid);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await productManager.create(req.body);
    
    // Emit socket event after creating product
    const products = await productManager.getAll();
    req.app.get('io').emit('products:update', products);
    
    res.status(201).json(product);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.update(pid, req.body);
    
    // Emit socket event after updating product
    const products = await productManager.getAll();
    req.app.get('io').emit('products:update', products);
    
    res.json(product);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteById(pid);
    
    // Emit socket event after deleting product
    const products = await productManager.getAll();
    req.app.get('io').emit('products:update', products);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;