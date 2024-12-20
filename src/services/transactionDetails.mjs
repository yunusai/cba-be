import TransactionDetails from "../models/transactionDetails.mjs";
import TransactionCustomers from "../models/transactionCustomers.mjs";
import Customers from "../models/customers.mjs";
import Products from "../models/products.mjs";
import Variations from "../models/productvariations.mjs";
import Agents from "../models/agents.mjs";
import { generateInvoice } from "../middleware/generateInvoice.mjs";
import multer from "multer";
import nodemailer from "nodemailer";
import { Midtrans } from "midtrans-client";
import { OrderStatus } from '../enum/OrderStatus.mjs'
import Sequelize from 'sequelize';
import path from "path";
import fs from 'fs'
import db from '../config/database.mjs'

const __dirname = path.dirname(new URL(import.meta.url).pathname);
console.log("Ini dirname: ", __dirname)

export const getAllTransactionDetails = async () => {
    return await TransactionDetails.findAll({
        include: [
            {
                model: Products,
                attributes: ['productName'], // Kolom yang diambil dari Products
            },
            {
                model: Variations,
                // Menghubungkan Variations dengan Products
                attributes: ['variationName', 'price', 'agentFee', 'additionalCost'], //
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
                attributes: ['productName'],
                // Kolom yang diambil dari Products
            },

            {
                model: Variations,
                // Menghubungkan Variations dengan Products
                attributes: ['variationName', 'price', 'agentFee', 'additionalCost'], //
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
    const { customerIds, variationId, productId, subtotal, transactionStatus } = data;

    const product = await Products.findByPk(productId);
    const variation = await Variations.findByPk(variationId);

    if (!product) {
        throw new Error('Product not found');
    }
    if (!variation) {
        throw new Error('variation not found');
    }

    // Buat transactionCode tanpa menggunakan tanda hubung
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const transactionCode = `${customerIds[0]}${today}`;

    const totalSubtotal = subtotal + variation.agentFee + (variation.additionalCost || 0);
    const status = transactionStatus || 'Pending';
    const transactionDetail = await TransactionDetails.create({
        transactionCode,  // Masukkan transactionCode secara eksplisit
        productId,
        variationId,
        quantity: customerIds.length,
        subtotal: totalSubtotal,
        orderStatus: 'Processing',       // Default untuk orderStatus
        transactionStatus: status,   // Default untuk transactionStatus
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
        product: product.productName,
        variation: variation.variationName,
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
    const { customerIds, variationId, productId, quantity, subtotal } = data;
    const transactionDetails = await TransactionDetails.findByPk(id);

    if (!transactionDetails) throw new Error('Transaction detail not found');

    const products = await Products.findByPk(productId);
    if (!products) {
        throw new Error('Product not found');
    }
    const variations = await Variations.findByPk(variationId);
    if (!products) {
        throw new Error('Product not found');
    }

    transactionDetails.variationId = variationId;
    transactionDetails.productId = productId;
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
    if (!transactionDetails) throw new Error('Transaction Detail not found');

    await transactionDetails.destroy();
    return { message: `Transaction Detail with id: ${id} deleted successfully` };
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
const uploadDir = path.resolve(__dirname, 'uploads');
console.log("ini uploadDir: ", uploadDir);
// if (!fs.existsSync(uploadDir)) {
//     console.log("sebelum mkdir: ", uploadDir);
//     fs.mkdirSync(uploadDir, { recursive: true }); // Pastikan dengan { recursive: true }
// }


//setup multer untuk file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Direktori untuk menyimpan file
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Format nama file
    }
});

export const upload = multer({ storage });

//service untuk memperbari status transaksi dan mengunggah file
export const updateTransactionStatus = async (transactionCode, status, file) => {
    const transactionDetail = await TransactionDetails.findOne({ where: { transactionCode } });
    if (!transactionDetail) throw new Error('Transaction not found');

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
const sendEmailWithAttachment = async (transactionDetail, file) => {
    //Ambil data customer dan product
    // Ambil semua customer yang terkait dengan transactionDetail
    const customers = await Customers.findAll({
        include: [{
            model: TransactionDetails,
            where: { id: transactionDetail.id } // Ambil customer yang terhubung dengan transactionDetail
        }]
    });
    const product = await Products.findByPk(transactionDetail.productId);

    if (!product) {
        throw new Error('Product not found');
    }
    const variation = await Variations.findByPk(transactionDetail.variationId);

    if (!variation) {
        throw new Error('variation not found');
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
    const fraudStatus = statusResponse.fraud_status;

    // Temukan transaksi berdasarkan order_id
    const transaction = await TransactionDetails.findOne({ where: { transactionCode: orderId } });
    if (!transaction) {
        throw new Error(`Transaction with order ID ${orderId} not found`);
    }

    // Perbarui status transaksi berdasarkan status dari Midtrans
    if (transactionStatus === "capture") {
        if (fraudStatus === "accept") {
            transaction.transactionStatus = "Paid";
        } else {
            transaction.transactionStatus = "Fraud";
        }
    } else if (transactionStatus === "settlement") {
        transaction.transactionStatus = "Paid";
    } else if (transactionStatus === "pending") {
        transaction.transactionStatus = "Pending";
    } else if (transactionStatus === "deny") {
        transaction.transactionStatus = "Denied";
    } else if (transactionStatus === "expire") {
        transaction.transactionStatus = "Expired";
    } else if (transactionStatus === "cancel") {
        transaction.transactionStatus = "Canceled";
    }

    await transaction.save();
    return transaction;
};

export const createSnapToken = async (invoiceNumber) => {
    const transactionDetail = await TransactionDetails.findOne({ where: { invoiceNumber } });
    if (!transactionDetail) throw new Error('Invoice Number not found');

    // Ambil data customer yang terlibat
    const transactionCustomers = await TransactionCustomers.findAll({ where: { transactionId: transactionDetail.id } });
    const customers = await Promise.all(transactionCustomers.map(tc => Customers.findByPk(tc.customerId)));
    const product = await Products.findByPk(transactionDetail.productId);
    const variation = await Products.findByPk(transactionDetail.variationId);

    if (!product || !variation || customers.length === 0) throw new Error('Product, variation or customers not found');


    const parameter = {
        transaction_details: {
            order_id: invoiceNumber,
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
                variationId: transactionDetail.variationId,
                price: variation.price,
                agentFee: variation.agentFee,
                quantity: transactionDetail.quantity,
                name: "Pembelian Service",
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

export const trackOrderByInvoice = async (invoiceNumber) => {
    // Mencari transaksi berdasarkan invoiceNumber
    const query = `
        SELECT
            td.invoiceNumber,
            td.transactionStatus,
            td.orderStatus,
            p.productName,
            v.variationName,
            v.price AS productPrice,
            v.agentFee,
            c.fullName AS customerName,
            c.email AS customerEmail,
            c.phoneNumber AS customerPhone
        FROM transactionDetails td
        LEFT JOIN products p ON td.productId = p.id
        LEFT JOIN variations v on td.variationId = v.id
        LEFT JOIN transactionCustomers tc ON td.id = tc.transactionId
        LEFT JOIN customers c ON tc.customerId = c.id
        WHERE td.invoiceNumber = :invoiceNumber;
    `;

    const results = await db.query(query, {
        type: db.QueryTypes.SELECT,
        replacements: { invoiceNumber }
    });

    if (results.length === 0) {
        throw new Error('Transaction not found');
    }

    // Strukturkan hasil jika ada banyak pelanggan
    const response = {
        invoiceNumber: results[0].invoiceNumber,
        productName: results[0].productName,
        variationName: results[0].variationName,
        productPrice: results[0].productPrice,
        agentFee: results[0].agentFee,
        transactionStatus: results[0].transactionStatus,
        orderStatus: results[0].orderStatus,
        customers: results.map(result => ({
            fullName: result.customerName,
            email: result.customerEmail,
            phoneNumber: result.customerPhone
        }))
    };

    return response;
};
