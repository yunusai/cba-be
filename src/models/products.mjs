import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

const {DataTypes} = Sequelize;

const Products = db.define('products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
    }
})

export default Products;
