import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

const { DataTypes } = Sequelize;

const TransactionCustomers = db.define('transactionCustomers',{
    transactionDetailId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'TransactionDetail',
            key: 'id',
        },
    },
    customerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Customer',
            key: 'id',
        },
    }
}, {
    timestamps: false
})

export default TransactionCustomers;
