import express from 'express'
import * as transactionDetailsController from '../controller/transactionDetails.mjs'
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.mjs';

const router = express.Router();

/**
 * @openapi
 * /transaction-detail:
 *   get:
 *     summary: Retrieve all transaction details
 *     responses:
 *       '200':
 *         description: Successfully retrieved all transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   transactionCode:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   subtotal:
 *                     type: number
 *                   tanggalSewa:
 *                     type: string
 *                     format: date-time
 *                   akhirSewa:
 *                     type: string
 *                     format: date-time
 *                   tanggalKirim:
 *                     type: string
 *                     format: date-time
 *                   tanggalTerima:
 *                     type: string
 *                     format: date-time
 *                   customerId:
 *                     type: integer
 *                   productId:
 *                     type: integer
 *   post:
 *     summary: Create a new transaction detail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionCode:
 *                 type: string
 *               quantity:
 *                 type: number
 *               subtotal:
 *                 type: number
 *               tanggalSewa:
 *                 type: string
 *                 format: date-time
 *               akhirSewa:
 *                 type: string
 *                 format: date-time
 *               tanggalKirim:
 *                 type: string
 *                 format: date-time
 *               tanggalTerima:
 *                 type: string
 *                 format: date-time
 *               customerId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Transaction detail created successfully
 * /transaction-detail/{id}:
 *   get:
 *     summary: Retrieve a transaction detail by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved transaction detail by ID
 *   put:
 *     summary: Update a transaction detail by ID
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
 *               transactionCode:
 *                 type: string
 *               quantity:
 *                 type: number
 *               subtotal:
 *                 type: number
 *               tanggalSewa:
 *                 type: string
 *                 format: date-time
 *               akhirSewa:
 *                 type: string
 *                 format: date-time
 *               tanggalKirim:
 *                 type: string
 *                 format: date-time
 *               tanggalTerima:
 *                 type: string
 *                 format: date-time
 *               customerId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Transaction detail updated successfully
 *   delete:
 *     summary: Delete a transaction detail by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Transaction detail deleted successfully
 */
router.get('/transaction-detail', authenticateToken, transactionDetailsController.getAllTransactionDetails)
router.get('/transaction-detail/:id', authenticateToken, transactionDetailsController.getTransactionDetailById)
router.post('/transaction-detail', authenticateToken, transactionDetailsController.createTransactionDetail)
router.put('/transaction-detail/:id', authenticateToken, transactionDetailsController.updateTransactionDetail)
router.delete('/transaction-detail/:id', authenticateToken, transactionDetailsController.deleteTransactionDetail)

export default router;
