import { Sequelize } from "sequelize";
import db from "../config/dabatase.mjs";
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
    customer: {
        type: DataTypes.INTEGER,
        references: {model: Customers, key: 'id'},
        allowNull: false
    },
    product: {
        type: DataTypes.INTEGER,
        references: {model: Products, key: 'id'},
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: (TransactionDetail) =>{
            //logic untuk menggabungkan customerId dan tanggal hari itu
            TransactionDetail.transactionCode = `${TransactionDetail.customer}-${new Date().toISOString().split('T')[0]}`
        }
    }
})

TransactionDetails.belongsTo(Customers, {foreignKey: 'customerId'});
TransactionDetails.belongsTo(Products, {foreignKey: 'productId'});

export default TransactionDetails;
