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

export const deleteProducts = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).json({ message: 'product data deleted' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getProductDetails = async (req, res) => {
    try {
        const products = await productService.getDetailProducts(req.params.id);
        res.json(products);
    } catch (error) {
        res.status(400).json({ message: error.message })
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

export const createProducts = async (req, res) => {
    try {
        const { productData, variationsData } = req.body;
        const result = await productService.createProduct(productData, variationsData);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        console.log(req.params.id);
        const productId = req.params.id; // Ambil productId dari parameter URL
        const { productData, variationsData } = req.body; // Ambil data produk dan variasi dari body request

        // Panggil service untuk melakukan update produk dan variasi
        const result = await productService.updateProduct(productId, productData, variationsData);

        // Kirimkan respons sukses
        res.status(200).json({ result });
    } catch (error) {
        console.error('Error updating product with variations:', error.message);

        // Kirimkan respons error
        res.status(500).json({
            error: error.message,
        });
    }
};