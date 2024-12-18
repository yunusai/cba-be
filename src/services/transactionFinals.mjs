import TransactionFinals from "../models/transactionFinals.mjs";
import TransactionDetails from "../models/transactionDetails.mjs";

export const createTransactionFinal = async (transactionCode, totalPay) =>{
    try {
        const transactionDetails = await TransactionDetails.findAll({ where: { transactionCode } })

        if(transactionDetails.length === 0){
            throw new Error('No transaction details found with given transaction code');
        }

        const totalAmount = transactionDetails.reduce((sum, detail) => sum + (detail.subtotal*detail.quantity), 0);
        console.log(`totalAmount = ${totalAmount}`);
        console.log(`totalPay = ${totalPay}`);

        if(totalPay < totalAmount){
            throw new Error('Total payment is less than the total amount');
        }

        // Validasi data sebelum membuat entri
        if (typeof totalPay !== 'number' || typeof totalAmount !== 'number') {
            throw new Error('Invalid data types for totalPay or totalAmount');
        }

        const transactionFinals = await TransactionFinals.create({
            transactionCode,
            totalPay,
            totalAmount
        });

        return {
            transactionFinals,
            change: totalPay > totalAmount ? totalPay - totalAmount : 0,
        };
    } catch (error) {
        console.error('Error creating TransactionFinals:', error); // Print more detailed error
        throw new Error(error.message);
    }
}
