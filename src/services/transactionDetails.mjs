import TransactionDetails from "../models/transactionDetails.mjs";
import Customers from "../models/customers.mjs";
import Products from "../models/products.mjs";
import moment from 'moment'

export const getAllTransactionDetails = async () => {
    return await TransactionDetails.findAll();
}

export const getTransactionDetailById = async (id) => {
    const transactionDetails = await TransactionDetails.findByPk(id);
    if (!transactionDetails) throw new Error('Transaction Detail not found');

    return transactionDetails;
}

export const createTransactionDetail = async (data) => {
    const { customer, product, quantity, subtotal, tanggalSewa, akhirSewa, tanggalKirim, tanggalTerima } = data;
    const customers = await Customers.findByPk(customer);
    const products = await Products.findByPk(product);

    if(!customers || !products){
        throw new Error('Customer or Product not found');
    }

    const transactionDetails = await TransactionDetails.create({
        customer, product, quantity, subtotal, tanggalSewa,
        akhirSewa, tanggalKirim, tanggalTerima
    });
    //Reload instance untuk memastikan semua data termasuk transactionCode terambil
    transactionDetails = await transactionDetails.reload();

    return transactionDetails;
}

export const updateTransactionDetail = async (id, data) => {
    const { customer, product, quantity, subtotal, tanggalSewa, akhirSewa, tanggalKirim, tanggalTerima } = data;
    const transactionDetails = await TransactionDetails.findByPk(id);

    if(!transactionDetails) throw new Error('Transaction detail not found');

    const customers = await Customers.findByPk(customer);
    const products = await Products.findByPk(product);
    if (!customers || !products) {
        throw new Error('Customer or Product not found');
    }

    transactionDetails.customer = customer;
    transactionDetails.product = product;
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
