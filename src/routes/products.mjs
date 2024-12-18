import express from 'express'
import * as productController from '../controller/products.mjs'
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/product', optionalAuth, productController.getAllProducts);
router.get('/product/:id', productController.getProductDetails);
router.post('/product', authenticateToken, productController.createProduct);
router.put('/product/:id', authenticateToken, productController.updateProducts);
router.delete('/product/:id', authenticateToken, productController.deleteProducts);
router.get('/product/lookup', productController.lookupProducts)

export default router;
