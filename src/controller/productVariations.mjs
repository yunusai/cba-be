import * as variationService from "../services/productVariations.mjs";
import Products from "../models/products.mjs";
import Categories from "../models/categories.mjs";

export const getAllVariations = async (req, res) => {
    try {
        const productId = req.query.productId;
        const isAuthorized = req.user ? true : false; // User memiliki token atau tidak
        const variations = await variationService.findAllVariations(productId, isAuthorized);
        res.json(variations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createVariation = async (req, res) => {
    try {
        const variations = await variationService.createVariations({
            ...req.body,
            // productName: req.body.productName,
            additionalCost: req.body.additionalCost || 0 // Default ke 0 jika tidak ada
        });
        res.status(201).json(variations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateVariations = async (req, res) => {
    try {
        const variations = await variationService.updateVariations(req.params.id, {
            ...req.body,
            additionalCost: req.body.additionalCost || 0 // Default ke 0 jika tidak ada
        });
        res.status(202).json(variations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteVariations = async (req, res) => {
    try {
        await variationService.deleteVariation(req.params.id);
        res.status(204).json({ message: 'variation data deleted' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getVariationDetails = async (req, res) => {
    try {
        const variations = await variationService.getDetailVariations(req.params.id);
        res.json(variations);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const lookupVariations = async (req, res) => {
    try {
        const variations = await variationService.lookupVariations();
        res.json(variations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
