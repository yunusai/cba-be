import express from 'express'
import * as transactionFinalsController from '../controller/transactionFinal.mjs'

const router = express.Router();

router.post('/', transactionFinalsController.createFinalController);

export default router;
