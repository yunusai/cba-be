import express from 'express'
import * as transactionDetailsController from '../controller/transactionDetails.mjs'
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.mjs';
import { upload } from '../services/transactionDetails.mjs';

const router = express.Router();

router.get('/transaction-detail', authenticateToken, transactionDetailsController.getAllTransactionDetails)
router.get('/transaction-detail/:id', authenticateToken, transactionDetailsController.getTransactionDetailById)
router.post('/transaction-detail', transactionDetailsController.createTransactionDetail)
router.put('/transaction-detail/:id', authenticateToken, transactionDetailsController.updateTransactionDetail)
router.delete('/transaction-detail/:id', authenticateToken, transactionDetailsController.deleteTransactionDetail)
router.get('/transaction-detail/status/:transactionCode', transactionDetailsController.checkTransactionStatus)
router.patch('/transaction-detail/update-status/:transactionCode',
     authenticateToken,
      upload.single('file'),
      transactionDetailsController.uploadAndUpdateTransaction
    );
router.get('/transaction-detail/snap-token/:invoiceNumber', transactionDetailsController.generateSnapToken);
router.patch('/transaction/:transactionId/order-status', transactionDetailsController.updateOrderStatusOnly);
router.get('/order-tracking/invoice/:invoiceNumber', transactionDetailsController.trackOrderByInvoice);
router.post('/payment-notification', transactionDetailsController.paymentNotificationHandler);

export default router;
