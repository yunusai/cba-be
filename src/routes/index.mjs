import express from "express";
import agentReview from './agentPerformance.mjs'
import productRoutes from './products.mjs'
import authRoutes from './authRoutes.mjs'
import appointmentRoutes from './appointment.mjs'
import transactionDetailRoutes from './transactionDetails.mjs'
import transactionFinalRoutes from './transationFinals.mjs'
import customersRoutes from './customers.mjs'
import countiresRoutes from './countries.mjs'
import categoryRoutes from './categories.mjs'
import path from 'path';
import { fileURLToPath } from "url";


const router = express.Router();

// Menentukan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Rute untuk mengakses file publik
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.use(agentReview);
router.use(productRoutes);
router.use(authRoutes);
router.use(appointmentRoutes);
router.use(transactionDetailRoutes);
router.use(transactionFinalRoutes);
router.use(customersRoutes);
router.use(countiresRoutes);
router.use(categoryRoutes);

export default router;
