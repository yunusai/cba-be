import express from 'express'
import * as variationController from '../controller/productVariations.mjs'
import updateAgentFeeController from '../controller/updateTableController.mjs';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/product-variation', optionalAuth, variationController.getAllVariations);
router.get('/product-variation/:id', variationController.getVariationDetails);
router.post('/product-variation', authenticateToken, variationController.createVariation);
router.put('/product-variation/:id', authenticateToken, variationController.updateVariations);
router.delete('/product-variation/:id', authenticateToken, variationController.deleteVariations);
router.get('/product-variation/lookup', variationController.lookupVariations);
router.put('/update-table', updateAgentFeeController);

export default router;
