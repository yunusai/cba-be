import express from 'express'
import * as productController from '../controller/products.mjs'

const router = express.Router();

router.get('/product', productController.getAllProducts);
router.get('/product/:id', productController.getProductDetails);
router.post('/product', productController.createProduct);
router.put('/product/:id', productController.updateProducts);
router.delete('/product/:id', productController.deleteProducts);

export default router;
