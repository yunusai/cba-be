import express from 'express'
import * as transactionDetailsController from '../controller/transactionDetails.mjs'

const router = express.Router();

router.get('/', transactionDetailsController.getAllTransactionDetails)
router.get('/:id', transactionDetailsController.getTransactionDetailById)
router.post('/', transactionDetailsController.createTransactionDetail)
router.put('/:id', transactionDetailsController.updateTransactionDetail)
router.delete('/:id', transactionDetailsController.deleteTransactionDetail)

export default router;
