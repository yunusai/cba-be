import express from 'express'
import * as customerController from '../controller/customers.mjs'
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.mjs';

const router = express.Router();

/**
 * @openapi
 * /customers:
 *   get:
 *     summary: Retrieve all customers
 *     responses:
 *       '200':
 *         description: Successfully retrieved all customers
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
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   identity_type:
 *                     type: string
 *                   identity_number:
 *                     type: string
 *                   place_of_birth:
 *                     type: string
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                   age:
 *                     type: integer
 *                   nationality:
 *                     type: string
 *                   agentId:
 *                     type: integer
 *   post:
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               identity_type:
 *                 type: string
 *               identity_number:
 *                 type: string
 *               place_of_birth:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               age:
 *                 type: integer
 *               nationality:
 *                 type: string
 *               agentId:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Customer created successfully
 * /customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved customer by ID
 *   put:
 *     summary: Update a customer by ID
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               identity_type:
 *                 type: string
 *               identity_number:
 *                 type: string
 *               place_of_birth:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               age:
 *                 type: integer
 *               nationality:
 *                 type: string
 *               agentId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Customer updated successfully
 *   delete:
 *     summary: Delete a customer by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Customer deleted successfully
 */
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.get('/customers/name/:name', authenticateToken, customerController.getCustomerByName);
router.post('/customers', customerController.createCustomer); //untuk create customers baru bisa dilakukan oleh customers itu sendiri
router.put('/customers/:id', authenticateToken, customerController.updateCustomer);
router.delete('/customers/:id', authenticateToken, customerController.deleteCustomer);

export default router;
