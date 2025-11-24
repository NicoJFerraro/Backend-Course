import { Router } from 'express';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';

const router = Router();

// Legacy home (simple list)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('home', { products, title: 'Products List' });
  } catch (error) {
    res.status(500).render('home', { 
      products: [], 
      title: 'Products List',
      error: 'Error loading products' 
    });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('realTimeProducts', { 
      products, 
      title: 'Real Time Products' 
    });
  } catch (error) {
    res.status(500).render('realTimeProducts', { 
      products: [], 
      title: 'Real Time Products',
      error: 'Error loading products' 
    });
  }
});

// Paginated products view
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, query, sort } = req.query;
    const filter = {};
    if (query) {
      const q = String(query).toLowerCase();
      if (q === 'available') filter.status = true; else if (q === 'unavailable') filter.status = false; else filter.category = query;
    }
    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1; else if (sort === 'desc') sortOption.price = -1;
    const result = await Product.paginate(filter, { page: parseInt(page) || 1, limit: parseInt(limit) || 10, sort: sortOption, lean: true });

    // Ensure we have a cart id to use for add-to-cart buttons
    let cartId = req.query.cartId;
    if (!cartId) {
      const existing = await Cart.findOne();
      if (existing) cartId = existing._id.toString();
      else {
        const created = await Cart.create({ products: [] });
        cartId = created._id.toString();
      }
    }

    const baseUrl = '/products';
    const buildLink = (targetPage) => {
      const params = new URLSearchParams({ ...req.query, page: targetPage, cartId });
      return `${baseUrl}?${params.toString()}`;
    };

    res.render('products', {
      title: 'Products',
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
      cartId
    });
  } catch (error) {
    res.status(500).render('products', { 
      title: 'Products',
      products: [],
      error: 'Error loading paginated products'
    });
  }
});

// Product detail view
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).render('productDetail', { title: 'Product Detail', error: 'Product not found' });
    res.render('productDetail', { title: 'Product Detail', product });
  } catch (error) {
    res.status(500).render('productDetail', { title: 'Product Detail', error: 'Error loading product' });
  }
});

// Cart view
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).render('cart', { title: 'Cart', error: 'Cart not found', products: [] });
    const products = cart.products.map(p => ({
      id: p.product._id.toString(),
      title: p.product.title,
      price: p.product.price,
      quantity: p.quantity,
      subtotal: p.quantity * p.product.price
    }));
    const total = products.reduce((acc, cur) => acc + cur.subtotal, 0);
    res.render('cart', { title: 'Cart', products, cartId: cart._id.toString(), total });
  } catch (error) {
    res.status(500).render('cart', { title: 'Cart', error: 'Error loading cart', products: [] });
  }
});

export default router;