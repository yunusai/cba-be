import * as productService from "../services/products.mjs";
import Categories from "../models/categories.mjs";

export const getAllProducts = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        const isAuthorized = req.user ? true : false; // User memiliki token atau tidak
        const products = await productService.findAllProducts(categoryId, isAuthorized);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createProduct = async (req, res) => {
    try {
        const products = await productService.createProducts({
            ...req.body // Default ke 0 jika tidak ada
        });
        res.status(201).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProducts = async (req, res) => {
    try {
        const products = await productService.updateProducts(req.params.id, {
            ...req.body,// Default ke 0 jika tidak ada
        });
        res.status(202).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProducts = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).json({message: 'product data deleted'});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const getProductDetails = async (req, res) => {
    try {
        const products = await productService.getDetailProducts(req.params.id);
        res.json(products);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const lookupProducts = async (req, res) => {
    try {
        const products = await productService.lookupProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
