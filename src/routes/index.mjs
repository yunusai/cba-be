import express from "express";
import agentReview from './agentPerformance.mjs'
import productRoutes from './products.mjs'
import authRoutes from './authRoutes.mjs'
import appointmentRoutes from './appointment.mjs'
import transactionDetailRoutes from './transactionDetails.mjs'
import transactionFinalRoutes from './transationFinals.mjs'
import customersRoutes from './customers.mjs'
import countiresRoutes from './countries.mjs'


const router = express.Router();

router.use(agentReview);
router.use(productRoutes);
router.use(authRoutes);
router.use(appointmentRoutes);
router.use(transactionDetailRoutes);
router.use(transactionFinalRoutes);
router.use(customersRoutes);
router.use(countiresRoutes)

export default router;
