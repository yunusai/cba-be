import express from 'express'
import { getAgents } from '../controller/agents.mjs'

const router = express.Router();

router.get('/users', getAgents);

export default router
