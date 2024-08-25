import express from 'express'
import { getAgentPerformance } from '../controller/agentPerformanceController.mjs'

const router = express.Router();

/**
 * @openapi
 * /review:
 *   get:
 *     summary: Retrieve agent performance data
 *     responses:
 *       '200':
 *         description: Successfully retrieved agent performance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 performance:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 */
router.get('/review', getAgentPerformance);

export default router;
