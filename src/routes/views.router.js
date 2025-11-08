import { Router } from 'express';
import { productManager } from '../instances.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getAll();
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
    const products = await productManager.getAll();
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

export default router;