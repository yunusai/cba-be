import Products from "../models/products.mjs";
import Categories from "../models/categories.mjs";
import Variations from "../models/productVariations.mjs";
import db from "../config/database.mjs";
import { Sequelize } from "sequelize";


export const deleteProduct = async (id) => {
    const transaction = await db.transaction();

    try {
        // Temukan produk berdasarkan ID
        const product = await Products.findByPk(id, { transaction });
        if (!product) throw new Error('Product not found');

        // Hapus variasi yang terkait dengan produk
        await Variations.destroy({
            where: { productId: id },
            transaction
        });

        // Hapus produk
        await product.destroy({ transaction });

        // Commit transaksi
        await transaction.commit();
        console.log('Product and its variations deleted successfully');
    } catch (error) {
        // Rollback jika terjadi kesalahan
        await transaction.rollback();
        console.error('Failed to delete product and variations: ', error.message);
        throw error;
    }
};
export const findAllProducts = async (categoryId, isAuthorized) => {
    try {
        const queryOptions = {
            where: {},
            include: [
                { model: Categories, attributes: ['id', 'category'] },
                { model: Variations, attributes: ['id', 'variationName', 'price', 'agentFee', 'additionalCost'] }
            ],
        };

        if (categoryId) {
            queryOptions.where.categoryId = categoryId;
        }

        const products = await Products.findAll(queryOptions);
        return products.map(product => product.toJSON());
    } catch (error) {
        throw new Error('Failed to fetch products: ' + error.message);
    }
}

export const getDetailProducts = async (id) => {

    const queryOptions = {
        where: { id },
        include: [
            { model: Categories, attributes: ['id', 'category'] },
            { model: Variations, attributes: ['id', 'variationName', 'price', 'agentFee', 'additionalCost'] }
        ],
    };


    const products = await Products.findOne(queryOptions);

    if (!products) throw new Error('Product not found');

    return products.toJSON();
}

export const lookupProducts = async () => {
    const products = await Products.findAll({
        attributes: ['id', 'productName'], // Tambahkan 'additionalCost'
    });
    return products.map(product => product.toJSON());
};

export const createProduct = async (productData, variationsData) => {
    try {
        console.log(productData, variationsData)
        const product = await Products.create(productData);

        if (variationsData && variationsData.length > 0) {
            const variations = await Variations.bulkCreate(
                variationsData.map((variation) => ({
                    ...variation,
                    productId: product.id,
                }))
            );
            return { product, variations };
        }

        return { product, variations: [] };
    } catch (error) {
        throw new Error('Failed to create product with variations: ' + error.message);
    }
};


export const updateProduct = async (productId, productData, variationsData) => {
    const transaction = await db.transaction();

    try {
        // Update Product
        const product = await Products.findByPk(productId, { transaction });
        if (!product) {
            throw new Error('Product not found');
        }

        await product.update(productData, { transaction });

        // Update Variations
        if (variationsData && variationsData.length > 0) {
            for (const variation of variationsData) {
                const { id, ...variationData } = variation;

                if (id) {
                    // Update existing variation
                    const existingVariation = await Variations.findByPk(id, { transaction });
                    if (!existingVariation) {
                        throw new Error(`Variation with id ${id} not found`);
                    }
                    await existingVariation.update(variationData, { transaction });
                } else {
                    // Add new variation
                    await Variations.create({ ...variationData, productId }, { transaction });
                }
            }
        }

        // Commit transaction
        await transaction.commit();

        return { message: 'Product and variations updated successfully', product };
    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        throw new Error('Failed to update product with variations: ' + error.message);
    }
};
