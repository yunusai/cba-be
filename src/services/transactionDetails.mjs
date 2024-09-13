import TransactionDetails from "../models/transactionDetails.mjs";
import Customers from "../models/customers.mjs";
import Products from "../models/products.mjs";
import multer from "multer";
import nodemailer from "nodemailer";
import Midtrans from "midtrans-client";
import path from "path";
import fs from 'fs'

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

    // Buat transactionCode tanpa menggunakan tanda hubung
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const transactionCode = `${customerId}${today}`;


    const transactionDetail = await TransactionDetails.create({
        transactionCode,  // Masukkan transactionCode secara eksplisit
        customerId,
        productId,
        quantity,
        subtotal,
        tanggalSewa,
        akhirSewa,
        tanggalKirim,
        tanggalTerima,
        status: 'Pending'
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

export const checkTransactionStatus = async (transactionCode) => {
    const transactionDetail = await TransactionDetails.findOne({ where: { transactionCode } });
    if (!transactionDetail) throw new Error('Transaction not found');

    return transactionDetail.status;  // Mengembalikan status transaksi
}

// Buat folder uploads jika belum ada
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


//setup multer untuk file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Direktori untuk menyimpan file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); //format nama file
    }
});

export const upload = multer({storage: storage});

//service untuk memperbari status transaksi dan mengunggah file
export const updateTransactionStatus = async (transactionCode, status, file) => {
    const transactionDetail = await TransactionDetails.findOne({where: {transactionCode}});
    if(!transactionDetail) throw new Error('Transaction not found');

    //Perbarui status transaksi
    transactionDetail.status = status;
    await transactionDetail.save();

    //kirim email jika status diubah menjadi Done
    if (status === 'Done') {
        // Pastikan file ada sebelum kirim email
        if (!file) {
            throw new Error('No file provided for email attachment');
        }

        await sendEmailWithAttachment(transactionDetail, file);
    }

    return transactionDetail;
}

//Fungsi untuk mengirim email lampiran
const sendEmailWithAttachment = async(transactionDetail, file) => {
    //Ambil data customer dan product
    const customer = await Customers.findByPk(transactionDetail.customerId);
    const product = await Products.findByPk(transactionDetail.productId);

    if(!customer || !product) {
        throw new Error('Customer or Product not found');
    }

    //setup nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customer.email,
        subject: `Transaction Update: ${transactionDetail.transactionCode}`,
        text: `Hello ${customer.name},\n\nYour transaction with code ${transactionDetail.transactionCode} has been marked as Done. Please find the attached document for your reference.\n\nRegards,\nCBA`,
        attachments: [
            {
                filename: file.originalname,
                path: path.resolve(file.path)
            }
        ]
    };

    // Kirim email
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Failed to send email with attachment: ' + error.message);
    }
}

// setup Snap payment
const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export const createSnapToken = async (transactionCode) => {
    //cari transaksi berdasarkan transactionCode
    const transactionDetail = await TransactionDetails.findOne({where: {transactionCode}});
    if (!transactionDetail) throw new Error('Transaction not found');

    const customer = await Customers.findByPk(transactionDetail.customerId);
    if (!customer) throw new Error('Customer not found');

    const parameter = {
        transaction_details: {
            order_id: transactionCode,
            gross_amount: transactionDetail.subtotal * transactionDetail.quantity,
        },
        customer_details: {
            first_name: customer.name,
            email: customer.email,
            phone: customer.phone_number
        },
        item_details: [
            {
                id: transactionDetail.productId,
                price: transactionDetail.subtotal,
                quantity: transactionDetail.quantity,
                name: "Pembelian Service"
            }
        ]
    };

    try {
        const snapResponse = await snap.createTransaction(parameter);
        return snapResponse.token;
    } catch (error) {
        throw new Error('Failed to create Snap token: ' + error.message);
    }
}
