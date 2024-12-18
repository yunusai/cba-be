import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
console.log("ini di generate invoice: ",__dirname)

export const generateInvoice = (invoiceData, transactionId) => {
    // Tentukan path untuk folder invoice
    const invoiceFolderPath = path.join(__dirname, '../../invoices');
    console.log("ini invoice folder? ", invoiceFolderPath)
    // Buat folder jika belum ada
    // if (!fs.existsSync(invoiceFolderPath)) {
    //     fs.mkdirSync(invoiceFolderPath, { recursive: true });
    // }

    const doc = new PDFDocument();
    const invoicePath = `invoices/invoice_${transactionId}.pdf`;

    doc.pipe(fs.createWriteStream(invoicePath));

    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(18).text(`Service: ${invoiceData.service}`);
    doc.text(`Total Person: ${invoiceData.totalPerson}`);
    doc.text(`Referral: ${invoiceData.referral}`);
    doc.text(`Full Name: ${invoiceData.fullname}`);
    doc.text(`Email: ${invoiceData.email}`);
    doc.text(`Phone: ${invoiceData.phone}`);
    doc.text(`Payment Status: ${invoiceData.paymentStatus}`);

    doc.end();

    return invoicePath;
};
