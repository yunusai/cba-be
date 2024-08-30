import express from 'express'
import { getAgentPerformance } from '../controller/agentPerformanceController.mjs'
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.mjs';

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
router.get('/review', authenticateToken, authorizeRole(['admin']), getAgentPerformance);

export default router;
