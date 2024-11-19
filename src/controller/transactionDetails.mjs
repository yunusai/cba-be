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
        if (!transactionDetails) {
            return res.status(404).json({ message: 'Transaction detail not found' });
        }
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
        UpdateTransactionStatusDTO.validate({ transactionCode, status });

        const file = req.file; // Mengambil file yang di-upload

        // Cek apakah file berhasil di-upload
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Perbarui status transaksi dan unggah file
        const transactionDetail = await transactionDetailController.updateTransactionStatus(transactionCode, status, file);
        res.json(transactionDetail);

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
        const { invoiceNumber } = req.params;
        const snapToken = await transactionDetailController.createSnapToken(invoiceNumber);
        res.json({ snapToken });
    } catch (error) {
        res.status(500).json({ message: 'Error generating Snap token', error: error.message });
    }
};

// Payment Notification Handler dari Midtrans
export const paymentNotificationHandler = async (req, res) => {
    const notification = req.body;

    try {
        const updatedTransaction = await handleMidtransNotification(notification);
        res.status(200).json({
            success: true,
            message: "Notification handled successfully",
            data: updatedTransaction,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to handle notification: ${error.message}`,
        });
    }
};

// Update Status Order secara manual
export const updateOrderStatus = async (req, res) => {
    const { orderId, newStatus } = req.body;

    try {
        await transactionDetailController.updateOrderStatus(orderId, newStatus);
        res.status(200).send('Order status updated');
    } catch (error) {
        res.status(500).send('Failed to update order status');
    }
};

export const updateOrderStatusOnly = async (req, res) => {
    const { transactionId } = req.params;
    const { newStatus } = req.body;

    try {
        const updatedTransaction = await transactionDetailController.updateOrderStatusOnly(transactionId, newStatus);
        res.status(200).json({
            message: 'Order status updated successfully',
            data: updatedTransaction,
        });
    } catch (error){
        res.status(400).json({ message: error.message });
    }
}

export const trackOrderByInvoice = async (req, res) => {
    try {
        const { invoiceNumber } = req.params; // Mengambil invoiceNumber dari URL params
        const trackingData = await transactionDetailController.trackOrderByInvoice(invoiceNumber);

        res.status(200).json({
            message: 'Tracking data found',
            data: trackingData
        });
    } catch (error) {
        res.status(404).json({
            message: 'Tracking not found',
            error: error.message
        });
    }
};
