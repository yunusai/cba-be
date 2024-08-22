import express from 'express'
import { getAgentPerformance } from '../controller/agentPerformanceController.mjs'

const router = express.Router();

router.get('/review', getAgentPerformance);

export default router;
