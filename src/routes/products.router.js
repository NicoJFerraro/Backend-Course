const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const pm = new ProductManager();

router.get('/', async (_req, res, next) => {
  try {
    const products = await pm.getAll();
    res.json({ status: 'success', payload: products });
  } catch (err) { next(err); }
});

router.get('/:pid', async (req, res, next) => {
  try {
    const product = await pm.getById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    res.json({ status: 'success', payload: product });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await pm.create(req.body);
    res.status(201).json({ status: 'success', payload: created });
  } catch (err) { next(err); }
});

router.put('/:pid', async (req, res, next) => {
  try {
    const updated = await pm.update(req.params.pid, req.body);
    res.json({ status: 'success', payload: updated });
  } catch (err) { next(err); }
});

router.delete('/:pid', async (req, res, next) => {
  try {
    const result = await pm.delete(req.params.pid);
    res.json({ status: 'success', payload: result });
  } catch (err) { next(err); }
});

module.exports = router;