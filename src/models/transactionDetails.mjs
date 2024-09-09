import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

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
    status: {
        type: DataTypes.ENUM('Pending', 'Done'),
        defaultValue: 'Pending'
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
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: (transactionDetail) => {
            // Pastikan transactionCode tidak null atau undefined
            if(!transactionDetail.transactionCode) {
                const today = new Date().toISOString().replace(/-/g, ''); // Format tanggal menjadi YYYY-MM-DD
                transactionDetail.transactionCode = `${customerId}${today}`;
            }
        }
    }
})

export default TransactionDetails;
