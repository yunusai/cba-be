import * as categoryService from "../services/categories.mjs"

// Create category
export const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update category by ID
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await categoryService.updateCategory(id, req.body);
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete category by ID
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await categoryService.deleteCategory(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
