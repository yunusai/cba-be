import express from 'express'
import SalesAnalytics from "../controller/salesAnalyticsController.mjs";

const router = express.Router();

//route untuk agentdetail
router.get('/agent-overview', SalesAnalytics.getAgentPerformance);
// Route untuk mendapatkan sales analytics overview
router.get('/get-overview', SalesAnalytics.getOverview)//route untuk overview
router.get('/get-byproducts', SalesAnalytics.getByProducts)//route untuk byproducts
router.get('/get-byorders', SalesAnalytics.getByOrders)//route untuk byorders
router.get('/get-byagents', SalesAnalytics.getByAgents)//route untuk byagents
router.get('/get-agentdetails/:id', SalesAnalytics.getAgentDetails)//route untuk agent detail

export default router;
