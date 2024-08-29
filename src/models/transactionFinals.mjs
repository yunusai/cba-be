import { Sequelize } from "sequelize";
import db from "../config/database.mjs";
import TransactionDetails from "./transactionDetails.mjs";

const {DataTypes} = Sequelize;

const TransactionFinals = db.define('transactionFinals', {
    transactionCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalPay: {
        type: DataTypes.DOUBLE,
    },
    totalAmount: {
        type: DataTypes.DOUBLE
    },
}, {
    hooks: {
        beforeCreate: async (transactionFinal) => {
        // Cari semua transactionDetails dengan transactionCode yang sama
            const transactionDetails = await TransactionDetails.findAll({
                where: { transactionCode: transactionFinal.transactionCode }
            });

            if (transactionDetails.length > 0) {
                // Hitung totalAmount dari semua transactionDetails yang memiliki transactionCode yang sama
                const totalAmount = transactionDetails.reduce((sum, detail) => sum + detail.subtotal, 0);
                transactionFinal.totalAmount = totalAmount;  // Tetapkan totalAmount ke instance transactionFinal
            } else {
                throw new Error('Tidak ada transactionDetails yang terkait ditemukan untuk transactionCode ini.');
            }
        }
    }
})

export default TransactionFinals;
