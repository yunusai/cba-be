import TransactionDetails from "../models/transactionDetails.mjs";
import Customers from "../models/customers.mjs";
import Products from "../models/products.mjs";
import * as transactionDetailController from "../services/transactionDetails.mjs";

export const getAllTransactionDetails = async (req, res) => {
    try {
        const transactionDetails = await transactionDetailController.getAllTransactionDetails();
        res.json(transactionDetails);
    } catch (error) {
        res.status(500).json({message: 'server error', error: error.message});
    }
}

export const getTransactionDetailById = async (req, res) => {
    try {
        const { id } = req.params;
        const transactionDetails = await transactionDetailController.getTransactionDetailById(id);

        res.json(transactionDetails);
    } catch (error) {
        res.status(404).json({message: 'Server Error', error: error.message});
    }
};

export const createTransactionDetail = async (req, res) => {
    try {
        const transactionDetails = await transactionDetailController.createTransactionDetail(req.body);
        res.json(transactionDetails);
    } catch (error) {
        res.status(400).json({message: 'Server Error', error: error.message});
    }
}

export const updateTransactionDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const transactionDetails = await transactionDetailController.updateTransactionDetail(id, req.body);
        res.json(transactionDetails);
    } catch (error) {
        res.status(400).json({message: 'Server Error', error: error.message});
    }
}

export const deleteTransactionDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await transactionDetailController.deleteTransactionDetail(id);
        res.json(result);
    } catch (error) {
        res.status(404).json({message: 'Server Error', error: error.message})
    }
}
