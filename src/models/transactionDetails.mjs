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
        type: DataTypes.DATE,
    },
    akhirSewa: {
        type: DataTypes.DATE,
    },
    tanggalKirim: {
        type: DataTypes.DATE,
    },
    tanggalTerima: {
        type: DataTypes.DATE,
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
            // Membuat transactionCode berdasarkan customerId dan tanggal saat ini
            const today = new Date().toISOString().split('T')[0]; // Format tanggal menjadi YYYY-MM-DD
            transactionDetail.transactionCode = `${transactionDetail.customerId}-${today}`;
        }
    }
})

TransactionDetails.belongsTo(Customers, {foreignKey: 'customerId'});
TransactionDetails.belongsTo(Products, {foreignKey: 'productId'});

export default TransactionDetails;
