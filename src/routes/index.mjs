import express from "express";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import agentReview from './agentPerformance.mjs'
import productRoutes from './products.mjs'
import variationRoutes from './productVariations.mjs'
import authRoutes from './authRoutes.mjs'
import appointmentRoutes from './appointment.mjs'
import transactionDetailRoutes from './transactionDetails.mjs'
import transactionFinalRoutes from './transationFinals.mjs'
import customersRoutes from './customers.mjs'
import countiresRoutes from './countries.mjs'
import categoryRoutes from './categories.mjs'
import salesAnalyticsRoutes from './salesAnalyticsRoutes.mjs'


const router = express.Router();

// Tentukan direktori 'uploads' dengan import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const uploadsDir = path.resolve(__dirname, 'uploads');
console.log(__dirname);

// Atur akses publik untuk folder 'uploads'
router.use('/uploads', express.static(uploadsDir));


router.use(agentReview);
router.use(authRoutes);
router.use(productRoutes);
router.use(variationRoutes);
router.use(appointmentRoutes);
router.use(transactionDetailRoutes);
router.use(transactionFinalRoutes);
router.use(customersRoutes);
router.use(countiresRoutes);
router.use(categoryRoutes);
router.use(salesAnalyticsRoutes);

export default router;
