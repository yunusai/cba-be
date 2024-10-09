import TransactionDetails from "../models/transactionDetails.mjs";
import Customers from "../models/customers.mjs";
import Products from "../models/products.mjs";
import * as transactionDetailController from "../services/transactionDetails.mjs";
import { UpdateTransactionStatusDTO } from "../dto/updateTransactionStatusDTO.mjs";
import multer from "multer";

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
        res.status(400).json({ message: 'Server Error', error: error.message });
    }
};

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

export const uploadAndUpdateTransaction = async (req, res) => {
    try {
        const { transactionCode } = req.params;
        const { status } = req.body;
        UpdateTransactionStatusDTO.validate({transactionCode, status});

        // Menggunakan middleware multer untuk mengunggah file
        transactionDetailController.upload.single('file')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ error: 'Multer error: ' + err.message });
            } else if (err) {
                return res.status(500).json({ error: 'Unknown error: ' + err.message });
            }


            const file = req.file;

            // Cek apakah file berhasil di-upload
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }


            // Perbarui status transaksi dan unggah file
            try {
                const transactionDetail = await transactionDetailController.updateTransactionStatus(transactionCode, status, file);
                res.json(transactionDetail);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }

        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const checkTransactionStatus = async (req, res) => {
    try {
        const status = await transactionDetailController.checkTransactionStatus(req.params.transactionCode);
        res.json({ status });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const generateSnapToken = async (req, res) => {
    try {
        const { transactionCode } = req.params;
        const snapToken = await transactionDetailController.createSnapToken(transactionCode);
        res.json({ snapToken });
    } catch (error) {
        res.status(500).json({ message: 'Error generating Snap token', error: error.message });
    }
};
