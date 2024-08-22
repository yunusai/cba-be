import express from 'express'
import * as customerController from '../controller/customers.mjs'

const router = express.Router();

router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.get('/customers/name/:name', customerController.getCustomerByName);
router.post('/customers', customerController.createCustomer);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);

export default router;
