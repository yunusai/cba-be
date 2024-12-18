import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

const { DataTypes } = Sequelize;

const Variations = db.define('variations', {
    variationName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    agentFee: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    additionalCost: {
        type: DataTypes.DOUBLE,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

export default Variations;
