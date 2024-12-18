import express from 'express'
import * as countryController from '../controller/countries.mjs'
import { authenticateToken } from '../middleware/authMiddleware.mjs'

const router = express.Router();

// CRUD Routes
router.get('/countries', authenticateToken, countryController.getAllCountries);
router.get('/countries/:id', authenticateToken, countryController.getCountryById);
router.post('/countries', authenticateToken, countryController.createCountry);
router.put('/countries/:id', authenticateToken, countryController.updateCountry);
router.delete('/countries/:id', authenticateToken, countryController.deleteCountry);

// Lookup API for frontend dropdown
router.get('/countries/lookup', countryController.lookupCountries);

export default router;
