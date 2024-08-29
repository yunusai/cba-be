import { Sequelize } from "sequelize";
import db from "../config/database.mjs";
import Customers from "./customers.mjs";
import Products from "./products.mjs";

const { DataTypes } = Sequelize;

const TransactionDetails = db.define('transactionDetails', {
    transactionCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    tanggalSewa: {
        type: DataTypes.DATEONLY,
    },
    akhirSewa: {
        type: DataTypes.DATEONLY,
    },
    tanggalKirim: {
        type: DataTypes.DATEONLY,
    },
    tanggalTerima: {
        type: DataTypes.DATEONLY,
    },
    customerId: {
        type: DataTypes.INTEGER,
        references: {model: Customers, key: 'id'},
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {model: Products, key: 'id'},
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: (transactionDetail) => {
            // Pastikan transactionCode tidak null atau undefined
            if(!transactionDetail.transactionCode) {
                const today = new Date().toISOString().split('T')[0]; // Format tanggal menjadi YYYY-MM-DD
                transactionDetail.transactionCode = `${transactionDetail.customerId}-${today}`;
            }
        }
    }
})

TransactionDetails.belongsTo(Customers, {foreignKey: 'customerId'});
TransactionDetails.belongsTo(Products, {foreignKey: 'productId'});

export default TransactionDetails;
