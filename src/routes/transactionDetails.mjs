import express from 'express'
import * as transactionDetailsController from '../controller/transactionDetails.mjs'

const router = express.Router();

router.get('/transaction-detail', transactionDetailsController.getAllTransactionDetails)
router.get('/transaction-detail/:id', transactionDetailsController.getTransactionDetailById)
router.post('/transaction-detail', transactionDetailsController.createTransactionDetail)
router.put('/transaction-detail/:id', transactionDetailsController.updateTransactionDetail)
router.delete('/transaction-detail/:id', transactionDetailsController.deleteTransactionDetail)

export default router;
