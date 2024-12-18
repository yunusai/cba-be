import Categories from "../models/categories.mjs";

// Create a new category
export const createCategory = async (categoryData) => {
    try {
        const category = await Categories.create(categoryData);
        return category.toJSON();
    } catch (error) {
        throw new Error('Failed to create category: ' + error.message);
    }
};

// Get all categories
export const getAllCategories = async () => {
    try {
        const categories = await Categories.findAll();

        return categories.map(category => category.toJSON());
    } catch (error) {
        throw new Error('Failed to fetch categories: ' + error.message);
    }
};

// Get category by ID
export const getCategoryById = async (id) => {
    try {
        const category = await Categories.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category.toJSON();
    } catch (error) {
        throw new Error('Failed to fetch category: ' + error.message);
    }
};

// Update category by ID
export const updateCategory = async (id, updatedData) => {
    try {
        const category = await Categories.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        await category.update(updatedData);
        return category.toJSON();
    } catch (error) {
        throw new Error('Failed to update category: ' + error.message);
    }
};

// Delete category by ID
export const deleteCategory = async (id) => {
    try {
        const category = await Categories.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        await category.destroy();
        return { message: 'Category deleted successfully' };
    } catch (error) {
        throw new Error('Failed to delete category: ' + error.message);
    }
};
