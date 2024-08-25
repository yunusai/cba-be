import express from 'express'
import * as authController from '../controller/authController.mjs'
import { authenticateToken } from '../middleware/authMiddleware.mjs'

const router = express.Router();

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User registered successfully
 * /login:
 *   post:
 *     summary: Login an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 * /refresh-token:
 *   post:
 *     summary: Refresh the authentication token
 *     responses:
 *       '200':
 *         description: Token refreshed successfully
 * /logout:
 *   post:
 *     summary: Logout the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 */
router.post('/register', authController.handleRegister);
router.post('/login', authController.handleLogin);
router.post('/refresh-token', authController.handleRefreshToken);
router.post('/logout', authenticateToken, authController.handleLogout);

export default router;
