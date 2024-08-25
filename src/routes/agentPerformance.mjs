import express from 'express'
import { getAgentPerformance } from '../controller/agentPerformanceController.mjs'

const router = express.Router();

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get agent performance reviews
 *     description: Retrieve a list of agent performance reviews.
 *     responses:
 *       200:
 *         description: A list of agent performance reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/review', getAgentPerformance);

export default router;
