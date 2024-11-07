import express from 'express'
import * as customerController from '../controller/customers.mjs'
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.get('/customers/name/:name', authenticateToken, customerController.getCustomerByName);
router.post('/customers', customerController.createCustomer); //untuk create customers baru bisa dilakukan oleh customers itu sendiri
router.put('/customers/:id', authenticateToken, customerController.updateCustomer);
router.delete('/customers/:id', authenticateToken, customerController.deleteCustomer);
router.put('/customers-batch', authenticateToken, customerController.updateCustomersBatch);

export default router;
