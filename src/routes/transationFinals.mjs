import express from 'express'
import * as transactionFinalsController from '../controller/transactionFinal.mjs'

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
router.post('/transaction-final', transactionFinalsController.createFinalController);

export default router;
