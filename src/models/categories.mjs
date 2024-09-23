import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

const { DataTypes } = Sequelize;

const Categories = db.define('category', {
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

export default Categories;
