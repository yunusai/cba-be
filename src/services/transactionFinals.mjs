import TransactionFinals from "../models/transactionFinals.mjs";
import TransactionDetails from "../models/transactionDetails.mjs";

export const createTransactionFinal = async (transactionCode, totalPay) =>{
    try {
        const transactionDetails = await TransactionDetails.findAll({ where: { transactionCode } })

        if(transactionDetails.length === 0){
            throw new Error('No transaction details found with given transaction code');
        }

        const totalAmount = transactionDetails.reduce((sum, detail) => sum + detail.subtotal, 0);

        if(totalPay < totalAmount){
            throw new Error('Total payment is less than the total amount');
        }

        const transactionFinals = await TransactionFinals.create({
            totalPay,
            totalAmount
        });

        return {
            transactionFinals,
            change: totalPay > totalAmount ? totalPay - totalAmount : 0,
        };
    } catch (error) {
        throw new Error(error.message);
    }
}
