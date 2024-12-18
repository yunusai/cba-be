import Variations from "../models/productVariations.mjs";
import Products from "../models/products.mjs";
import Categories from "../models/categories.mjs";
import { Sequelize } from "sequelize";

export const createVariations = async (data) => {
    try {
        const variations = await Variations.create(data);
        return variations;
    } catch (error) {
        throw new Error('Failed to create new product: ' + error.message);
    }
}

export const updateVariations = async (id, data) => {
    try {
        const variation = await Variations.findByPk(id);
        if (!variation) throw new Error('Variation not found');

        await variation.update({
            ...data
        })

        return variation;
    } catch (error) {
        throw new Error('Failed to update variation')
    }
}

export const deleteVariation = async (id) => {
    const variations = await Variations.findByPk(id);
    if (!variations) throw new Error('Variation not found');

    await variations.destroy();
}




export const findAllVariations = async (productId, isAuthorized) => {
    try {
        const queryOptions = {
            where: {},
            include: [
                {
                    model: Products, // Menambahkan categoryId pada Products
                    include: [
                        {
                            model: Categories,// Mengambil id dan category
                        }
                    ]
                }
            ]
        };

        if (productId) {
            queryOptions.include[0].where = { id: productId };
        }

        if (!isAuthorized) {
            queryOptions.where.price = { [Sequelize.Op.lte]: 15000000 }; // Filter harga di bawah 15 juta
        }

        const variations = await Variations.findAll(queryOptions);
        return variations.map(variation => variation.toJSON());
    } catch (error) {
        throw new Error('Failed to fetch variations: ' + error.message);
    }
};


export const getDetailVariations = async (id) => {
    const variations = await Variations.findByPk(id);
    if (!variations) throw new Error('Variation not found');

    return variations.toJSON();
}

export const lookupVariations = async () => {
    const variations = await Variations.findAll({
        attributes: ['id', 'variationName', 'price', 'additionalCost'], // Tambahkan 'additionalCost'
    });
    return variations.map(variation => variation.toJSON());
};
