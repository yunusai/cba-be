import express from 'express'
import * as transactionFinalsController from '../controller/transactionFinal.mjs'
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

/**
 * @openapi
 * /transaction-final:
 *   post:
 *     summary: Create a new transaction final
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionCode:
 *                 type: string
 *               totalPay:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Transaction final created successfully
 */
router.post('/transaction-final', authenticateToken, transactionFinalsController.createFinalController);

export default router;
