import { Sequelize } from "sequelize";
import db from "../config/dabatase.mjs";
import TransactionDetails from "./transactionDetails.mjs";

const {DataTypes} = Sequelize;

const TransactionFinals = db.define('transactionFinals', {
    totalPay: {
        type: DataTypes.DOUBLE,
    },
    totalAmount: {
        type: DataTypes.DOUBLE
    },
}, {
    hooks: {
        beforeCreate: async (transactionFinals, options) => {
            const transactionDetails = await TransactionDetails.findAll({
                where: { transactionCode: options.transactionCode}
            })
            const totalAmount = transactionDetails.reduce((sum, detail) => sum + detail.subtotal, 0)
            transactionFinals.totalAmount = totalAmount;
        }
    }
})

// Relationship between TransactionFinals and TransactionDetails
TransactionFinals.hasMany(TransactionDetails, { foreignKey: 'transactionFinalId' });
TransactionDetails.belongsTo(TransactionFinals, { foreignKey: 'transactionFinalId' });

export default TransactionFinals;
