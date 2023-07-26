import express from 'express';
import { ProductManager } from '../ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = productManager.getAllProducts(); 
  res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = productManager.getAllProducts(); 
  res.render('realTimeProducts', { products });
});

export default router;
