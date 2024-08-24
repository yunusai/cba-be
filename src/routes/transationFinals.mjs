import express from 'express'
import * as transactionFinalsController from '../controller/transactionFinal.mjs'

const router = express.Router();

router.post('/transaction-final', transactionFinalsController.createFinalController);

export default router;
