import express from 'express'
import SalesAnalyticsController from "../controller/salesAnalyticsController.mjs";

const router = express.Router();

// Route untuk mendapatkan sales analytics overview
router.get('/overview', SalesAnalyticsController.getOverview);
router.get('/agent-overview', SalesAnalyticsController.getAgentPerformance);

export default router;
