import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

const {DataTypes} = Sequelize;

const Products = db.define('products', {
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    service: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
    },
    additionalCost: {
        type: DataTypes.DOUBLE,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

export default Products;
