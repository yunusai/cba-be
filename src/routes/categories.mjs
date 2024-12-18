import express from 'express';
import * as categoryController from '../controller/categories.mjs';

const router = express.Router();

// Create category
router.post('/categories', categoryController.createCategory);
// Get all categories
router.get('/categories', categoryController.getAllCategories);
// Get category by ID
router.get('/categories/:id', categoryController.getCategoryById);
// Update category by ID
router.put('/categories/:id', categoryController.updateCategory);
// Delete category by ID
router.delete('/categories/:id', categoryController.deleteCategory);

export default router;
