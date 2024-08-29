import TransactionDetails from "../models/transactionDetails.mjs";
import Customers from "../models/customers.mjs";
import Products from "../models/products.mjs";

export const getAllTransactionDetails = async () => {
    return await TransactionDetails.findAll();
}

export const getTransactionDetailById = async (id) => {
    const transactionDetails = await TransactionDetails.findByPk(id);
    if (!transactionDetails) throw new Error('Transaction Detail not found');

    return transactionDetails;
}

export const createTransactionDetail = async (data) => {
    const { customerId, productId, quantity, subtotal, tanggalSewa, akhirSewa, tanggalKirim, tanggalTerima } = data;

    const customer = await Customers.findByPk(customerId);
    const product = await Products.findByPk(productId);

    if (!customer) {
        throw new Error('Customer not found');
    }

    if (!product) {
        throw new Error('Product not found');
    }

    // Buat transactionCode di sisi service, jika tidak ingin mengandalkan hooks
    const today = new Date().toISOString().split('T')[0];
    const transactionCode = `${customerId}-${today}`;

    const transactionDetail = await TransactionDetails.create({
        transactionCode,  // Masukkan transactionCode secara eksplisit
        customerId,
        productId,
        quantity,
        subtotal,
        tanggalSewa,
        akhirSewa,
        tanggalKirim,
        tanggalTerima
    });

    return transactionDetail;
};

export const updateTransactionDetail = async (id, data) => {
    const { customerId, productId, quantity, subtotal, tanggalSewa, akhirSewa, tanggalKirim, tanggalTerima } = data;
    const transactionDetails = await TransactionDetails.findByPk(id);

    if(!transactionDetails) throw new Error('Transaction detail not found');

    const customers = await Customers.findByPk(customerId);
    const products = await Products.findByPk(productId);
    if (!customers || !products) {
        throw new Error('Customer or Product not found');
    }

    transactionDetails.customerId = customerId;
    transactionDetails.product = productId;
    transactionDetails.quantity = quantity;
    transactionDetails.subtotal = subtotal;
    transactionDetails.tanggalSewa = tanggalSewa;
    transactionDetails.akhirSewa = akhirSewa;
    transactionDetails.tanggalKirim = tanggalKirim;
    transactionDetails.tanggalTerima = tanggalTerima;

    await transactionDetails.save();
    return transactionDetails;
}

export const deleteTransactionDetail = async (id) => {
    const transactionDetails = await TransactionDetails.findByPk(id);
    if(!transactionDetails) throw new Error('Transaction Detail not found');

    await transactionDetails.destroy();
    return { message: `Transaction Detail with id: ${id} deleted successfully`};
}
