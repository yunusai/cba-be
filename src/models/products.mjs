import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

const {DataTypes} = Sequelize;

const Products = db.define('products', {
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

export default Products;
