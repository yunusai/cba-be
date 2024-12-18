import * as transactionFinalsService from "../services/transactionFinals.mjs";

export const createFinalController = async (req, res) => {
    try {
        const {transactionCode, totalPay} = req.body;
        const result = await transactionFinalsService.createTransactionFinal(transactionCode, totalPay);

        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}
