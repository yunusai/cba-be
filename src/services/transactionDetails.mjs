import TransactionDetails from "../models/transactionDetails.mjs";
import TransactionCustomers from "../models/transactionCustomers.mjs";
import Customers from "../models/customers.mjs";
import Products from "../models/products.mjs";
import Agents from "../models/agents.mjs";
import { generateInvoice } from "../middleware/generateInvoice.mjs";
import multer from "multer";
import nodemailer from "nodemailer";
import { Midtrans } from "midtrans-client";
import { OrderStatus } from '../enum/OrderStatus.mjs'
import path from "path";
import fs from 'fs'

export const getAllTransactionDetails = async () => {
    return await TransactionDetails.findAll({
        include: [
            {
                model: Products,
                attributes: ['productName', 'price', 'service'] // Kolom yang diambil dari Products
            },
            {
                model: Customers,
                through: { attributes: [] }, // Mengosongkan kolom dari tabel perantara jika tidak diperlukan
                //attributes: ['fullName', 'email', 'phoneNumber'] // Kolom yang diambil dari Customers
            }
        ]
    });
}

export const getTransactionDetailById = async (id) => {
    const transactionDetails = await TransactionDetails.findByPk(id, {
        include: [
            {
                model: Products,
                attributes: ['productName', 'price', 'service'] // Kolom yang diambil dari Products
            },
            {
                model: Customers,
                through: { attributes: [] }, // Mengosongkan kolom dari tabel perantara jika tidak diperlukan
                //attributes: ['fullName', 'email', 'phoneNumber'] // Kolom yang diambil dari Customers
            }
        ]
    });
    if (!transactionDetails) throw new Error('Transaction Detail not found');

    return transactionDetails;
}

export const createTransactionDetail = async (data) => {
    const { customerIds, productId, subtotal} = data;

    const product = await Products.findByPk(productId);

    if (!product) {
        throw new Error('Product not found');
    }

    // Buat transactionCode tanpa menggunakan tanda hubung
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const transactionCode = `${customerIds[0]}${today}`;

    const totalSubtotal = subtotal + (product.additionalCost || 0);
    const transactionDetail = await TransactionDetails.create({
        transactionCode,  // Masukkan transactionCode secara eksplisit
        productId,
        quantity: customerIds.length,
        subtotal: totalSubtotal,
        orderStatus: 'Pending',       // Default untuk orderStatus
        transactionStatus: 'Pending',   // Default untuk transactionStatus
        tanggalSewa: null,
        akhirSewa: null,
        tanggalKirim: null,
        tanggalTerima: null
    });

    for (const customerId of customerIds) {
        const customer = await Customers.findByPk(customerId);
        if (!customer) throw new Error(`Customer with ID ${customerId} not found`);

        await TransactionCustomers.create({
            transactionId: transactionDetail.id,
            customerId
        });
    }

    // Ambil customer pertama untuk detail invoice
    const primaryCustomer = await Customers.findByPk(customerIds[0], {
        include: [{ model: Agents, attributes: ['name'] }]
    });
    if (!primaryCustomer) throw new Error('Primary customer not found');

    const agent = await Agents.findByPk(primaryCustomer.agentId, {

    })

    const invoiceData = {
        service: product.productName,
        totalPerson: customerIds.length,
        referral: agent.name,
        fullname: primaryCustomer.fullName,
        email: primaryCustomer.email,
        phone: primaryCustomer.phoneNumber,
        paymentStatus: 'Pending'
    }

    const invoicePath = generateInvoice(invoiceData, transactionDetail.invoiceNumber)

    await sendInvoiceEmail(invoiceData.email, invoicePath);

    return transactionDetail;
};

const sendInvoiceEmail = async (recipientEmail, invoicePath) => {
    const transporter = nodemailer.createTransport({
        host: "mail.cbaservices.id", // Ganti dengan hostname SMTP dari cPanel
        port: 465, // Port SMTP, biasanya 465 untuk SSL atau 587 untuk TLS
        secure: true, // true untuk port 465, dan false untuk port 587
        auth: {
            user: process.env.EMAIL_USER, // Email lengkap yang digunakan di cPanel
            pass: process.env.EMAIL_PASSWORD // Password email tersebut
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Your Invoice',
        text: 'Please find attached your invoice.',
        attachments: [
            {
                filename: 'invoice.pdf',
                path: invoicePath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};

export const updateTransactionDetail = async (id, data) => {
    const { customerIds, productId, quantity, subtotal} = data;
    const transactionDetails = await TransactionDetails.findByPk(id);

    if(!transactionDetails) throw new Error('Transaction detail not found');

    const products = await Products.findByPk(productId);
    if (!products) {
        throw new Error('Product not found');
    }

    transactionDetails.product = productId;
    transactionDetails.quantity = quantity;
    transactionDetails.subtotal = subtotal;

    await transactionDetails.save();

    await TransactionCustomers.destroy({ where: { transactionId: id } });
    for (const customerId of customerIds) {
        const customer = await Customers.findByPk(customerId);
        if (!customer) throw new Error(`Customer with ID ${customerId} not found`);

        await TransactionCustomers.create({
            transactionId: transactionDetails.id,
            customerId
        });
    }
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

export const updateOrderStatusOnly = async (transactionId, newStatus) => {
    // Validasi apakah status baru adalah salah satu dari enum OrderStatus
    if (!Object.values(OrderStatus).includes(newStatus)) {
        throw new Error('Invalid order status');
    }

    // Cari transaksi berdasarkan ID
    const transaction = await TransactionDetails.findByPk(transactionId);
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    // Update status order dan simpan perubahan
    transaction.orderStatus = newStatus;
    await transaction.save();

    return transaction;

}

// Fungsi untuk pembaruan status order secara manual
export const updateOrderStatus = async (orderId, newStatus) => {
    await TransactionOrder.update({ orderStatus: newStatus }, { where: { orderId } });
};

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
    transactionDetail.orderStatus = status;
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
    // Ambil semua customer yang terkait dengan transactionDetail
    const customers = await Customers.findAll({
        include: [{
            model: TransactionDetails,
            where: { id: transactionDetail.id } // Ambil customer yang terhubung dengan transactionDetail
        }]
    });
    const product = await Products.findByPk(transactionDetail.productId);

    if(!product) {
        throw new Error('Product not found');
    }

    // Pastikan ada customer sebelum mengirim email
    if (customers.length === 0) {
        throw new Error('No customer found for this transaction');
    }

    // Ambil customer pertama
    const customer = customers[0];

    //setup nodemailer
    let transporter = nodemailer.createTransport({

        host: "mail.cbaservices.id", // Ganti dengan hostname SMTP dari cPanel, biasanya smtp.namadomain.com
        port: 465, // Port SMTP, biasanya 465 untuk SSL atau 587 untuk TLS
        secure: true, // true untuk port 465, dan false untuk port 587
        auth: {
            user: process.env.EMAIL_USER, // Email lengkap yang digunakan di cPanel, e.g., "yourname@yourdomain.com"
            pass: process.env.EMAIL_PASSWORD // Password email tersebut
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
let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Fungsi untuk menangani notifikasi Midtrans dan memperbarui transactionStatus
export const handleMidtransNotification = async (notification) => {
    const statusResponse = await snap.transaction.notification(notification);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;

    if (transactionStatus === 'settlement') {
        await TransactionOrder.update({ transactionStatus: 'Paid' }, { where: { orderId } });
    }
};

export const createSnapToken = async (transactionCode) => {
    const transactionDetail = await TransactionDetails.findOne({ where: { transactionCode } });
    if (!transactionDetail) throw new Error('Transaction not found');

    // Ambil data customer yang terlibat
    const transactionCustomers = await TransactionCustomers.findAll({ where: { transactionId: transactionDetail.id } });
    const customers = await Promise.all(transactionCustomers.map(tc => Customers.findByPk(tc.customerId)));
    const product = await Products.findByPk(transactionDetail.productId);

    if (!product || customers.length === 0) throw new Error('Product or customers not found');


    const parameter = {
        transaction_details: {
            order_id: transactionCode,
            gross_amount: transactionDetail.subtotal * transactionDetail.quantity,
        },
        customer_details: {
            first_name: customers[0].name,
            email: customers[0].email,
            phone: customers[0].phone_number
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

        // Buat invoice setelah Snap token berhasil dibuat
        const invoice = {
            visitPurpose: "Business Meeting",
            visa: "Tourist Visa",
            service: product.name,
            totalPerson: customers.length,
            referral: "Some Referral Code",
            fullname: customers[0].name,
            email: customers[0].email,
            phone: customers[0].phone_number,
            hargaService: transactionDetail.subtotal,
            uploadedDocuments: [/* Berisi path file dokumen yang diupload */],
            paymentStatus: "Unpaid"
        };
        return snapResponse.token;
    } catch (error) {
        throw new Error('Failed to create Snap token: ' + error.message);
    }

}
