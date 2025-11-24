import { Router } from 'express';
import { Product } from '../models/Product.js';

const router = Router();

// GET /api/products with pagination, filtering, sorting
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;

    const parsedLimit = parseInt(limit) || 10;
    const parsedPage = parseInt(page) || 1;

    const filter = {};
    if (query) {
      const q = String(query).toLowerCase();
      if (q === 'available') filter.status = true;
      else if (q === 'unavailable') filter.status = false;
      else filter.category = query; // assume category match
    }

    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    else if (sort === 'desc') sortOption.price = -1;

    const result = await Product.paginate(filter, {
      limit: parsedLimit,
      page: parsedPage,
      sort: sortOption,
      lean: true
    });

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`; // /api/products

    const buildLink = (targetPage) => {
      const params = new URLSearchParams({ ...req.query, page: targetPage });
      return `${baseUrl}?${params.toString()}`;
    };

    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage || 0,
      nextPage: result.nextPage || 0,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      payload: [],
      totalPages: 0,
      prevPage: 0,
      nextPage: 0,
      page: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevLink: null,
      nextLink: null,
      error: error.message
    });
  }
});

// GET single product
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails = [], status = true } = req.body;
    if (!title || !description || !code || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ status: 'error', error: 'Missing required field' });
    }
    const exists = await Product.findOne({ code });
    if (exists) return res.status(400).json({ status: 'error', error: 'Code already exists' });
    const doc = await Product.create({ title, description, code, price, stock, category, thumbnails, status });
    const products = await Product.find().lean();
    req.app.get('io').emit('products:update', products);
    res.status(201).json({ status: 'success', payload: doc });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Update product
router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;
    if (updateData.code) {
      const conflict = await Product.findOne({ code: updateData.code, _id: { $ne: pid } });
      if (conflict) return res.status(400).json({ status: 'error', error: 'Code already exists' });
    }
    const updated = await Product.findByIdAndUpdate(pid, updateData, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ status: 'error', error: 'Product not found' });
    const products = await Product.find().lean();
    req.app.get('io').emit('products:update', products);
    res.json({ status: 'success', payload: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Delete product
router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await Product.findByIdAndDelete(pid).lean();
    if (!deleted) return res.status(404).json({ status: 'error', error: 'Product not found' });
    const products = await Product.find().lean();
    req.app.get('io').emit('products:update', products);
    res.json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;