import express from 'express'
import * as authController from '../controller/authController.mjs'
import { authenticateToken } from '../middleware/authMiddleware.mjs'

const router = express.Router();

router.post('/register', authController.handleRegister);
router.post('/login', authController.handleLogin);
router.post('/refresh-token', authController.handleRefreshToken);
router.post('/logout', authenticateToken, authController.handleLogout);
router.get('/agents', authController.getAllAgents);
router.get('/agents/:id', authController.getAgentById);
router.put('/agents/:id', authController.updateAgent);
router.delete('/agents/:id', authController.deleteAgent);

export default router;
