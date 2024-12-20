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
    orderStatus: {
        type: DataTypes.ENUM('Need Confirmation', 'Processing', 'On Hold', 'Cancel', 'Done'),
        defaultValue: 'Processing'
    },
    transactionStatus: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Denied', 'Expired', 'Canceled', 'Fraud'),
        defaultValue: 'Pending'
    },
    invoiceNumber: {
        type: DataTypes.STRING,
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
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    variationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: (transactionDetail) => {
            // Pastikan transactionCode tidak null atau undefined
            if (!transactionDetail.transactionCode) {
                const today = new Date().toISOString().split('T')[0].replace(/-/g, '');  // Format tanggal menjadi YYYY-MM-DD
                transactionDetail.transactionCode = `${customerId}${today}`;
            }

            // Generate invoiceNumber jika kosong
            if (!transactionDetail.invoiceNumber) {
                transactionDetail.invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            }
        }
    }
})



export default TransactionDetails;
