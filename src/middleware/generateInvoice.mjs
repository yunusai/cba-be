import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateInvoice = (invoiceData, transactionId) => {
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
