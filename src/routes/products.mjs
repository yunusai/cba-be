import express from 'express'
import * as productController from '../controller/products.mjs'

const router = express.Router();

/**
 * @openapi
 * /product:
 *   get:
 *     summary: Retrieve all products
 *     responses:
 *       '200':
 *         description: Successfully retrieved all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Product created successfully
 * /product/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved product by ID
 *   put:
 *     summary: Update a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Product deleted successfully
 */
router.get('/product', productController.getAllProducts);
router.get('/product/:id', productController.getProductDetails);
router.post('/product', productController.createProduct);
router.put('/product/:id', productController.updateProducts);
router.delete('/product/:id', productController.deleteProducts);

export default router;
