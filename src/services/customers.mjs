import Customers from "../models/customers.mjs";
import Agents from "../models/agents.mjs";
import Countries from "../models/countries.mjs";
import { Op } from "sequelize";
import db from "../config/database.mjs";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Function to check and create folders if they don't exist
const ensureDirectoryExistence = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};


// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileType = file.fieldname; // 'passport', 'visa', 'photo', 'docPendukung'
        let folder = '';

        switch (fileType) {
            case 'passport':
                folder = 'uploads/passport';
                break;
            case 'visa':
                folder = 'uploads/visa';
                break;
            case 'photo':
                folder = 'uploads/photo';
                break;
            case 'docPendukung':
                folder = 'uploads/docPendukung';
                break;
            default:
                folder = 'uploads/misc';
        }

        // Ensure folder exists
        ensureDirectoryExistence(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        let fileName = `${req.body.fullName}-${file.fieldname}${ext}`; // Nama file sesuai request

        // Handle multiple docPendukung uploads
        if (file.fieldname === 'docPendukung') {
            const docIndex = req.docPendukungIndex || 1; // Track index of multiple files
            fileName = `${req.body.fullName}-docPendukung${docIndex}${ext}`;
            req.docPendukungIndex = docIndex + 1; // Increment index for next file
        }

        cb(null, fileName);
    }
});

// File filter: hanya menerima JPG atau PDF
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.pdf' || ext === '.png') {
        cb(null, true);
    } else {
        cb(new Error('Only .jpg, .jpeg, and .pdf files are allowed'), false);
    }
};

// Set up multer upload with file size limit (e.g., 5 MB per file)
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Middleware untuk menangani upload file
export const uploadFiles = upload.fields([
    { name: 'passport', maxCount: 1 },
    { name: 'visa', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'docPendukung', maxCount: 10 },
]);

const getPublicUrl = (filePath) => {
    return `${process.env.SERVER_BASE_URL}/${filePath}`;
}


export const findAllCustomers = async () => {
    const customers = await Customers.findAll({
        include: [
            { model: Agents },
            { model: Countries, as: 'countryData' },  // Include relasi country
            { model: Countries, as: 'emergencyContactCountry' }  // Include relasi emergencyContactCountry
        ]
    });
    return customers.map(customers => customers.toJSON());
}

export const findCustomerById = async (id) => {
    const customers = await Customers.findByPk(id, {
        include: [
            { model: Agents },
            { model: Countries, as: 'countryData' },
            { model: Countries, as: 'emergencyContactCountry' }
        ]
    });
    if(!customers) throw new Error('Data not found')
    return customers.toJSON();
}

export const findCustomerByName = async (name) => {
    const customers = await Customers.findOne({
        where: {
            fullName: {
                [Op.like]: `%${name}%`  // Pencarian parsial, bisa di awal, tengah, atau akhir
            }
        },
        include: [
            { model: Agents },
            { model: Countries, as: 'countryData' },
            { model: Countries, as: 'emergencyContactCountry' }
        ]
    });
    if(!customers) throw new Error('Data Not Found');
    return customers.toJSON();
}

export const saveCustomer = async (input, files) => {
    const agent = await Agents.findByPk(input.agentId);
    if (!agent) {
        throw new Error(`Agent not found with ID ${input.agentId}`);
    }

    // Handling multiple docPendukung files
    const docPendukungUrls = files.docPendukung
        ? files.docPendukung.map((file) => getPublicUrl(file.path))
        : [];

    // Tambahkan path file ke input sebelum disimpan
    const customerData = {
        ...input,
        passport: files.passport ? getPublicUrl(files.passport[0].path) : null,
        visa: files.visa ? getPublicUrl(files.visa[0].path) : null,
        photo: files.photo ? getPublicUrl(files.photo[0].path) : null,
        docPendukung: docPendukungUrls.length > 0 ? JSON.stringify(docPendukungUrls) : null, // Array of URLs for multiple docPendukung files
    };

    const newCustomer = await Customers.create(customerData);
    return newCustomer.toJSON();
}

export const updateCustomer = async (id, customerInput) => {
    // Mulai transaction
    const transaction = await db.transaction();

    try {
        const customer = await Customers.findByPk(id, { transaction });
        if (!customer) {
            throw new Error(`Customer not found with ID ${id}`);
        }

        const agent = await Agents.findByPk(customerInput.agentId, { transaction });
        if (!agent) {
            throw new Error(`Agent not found with ID ${customerInput.agentId}`);
        }

        await customer.update(
            {
                ...customerInput,
                agentId: agent.id,
            },
            { transaction }
        );

        await transaction.commit(); // Selesaikan transaction jika berhasil

        return customer.toJSON();
    } catch (error) {
        await transaction.rollback(); // Batalkan transaction jika terjadi error
        throw error; // Lempar kembali error
    }
}

export const deleteCustomer = async (id) => {
    const customers = await Customers.findByPk(id);
    if(!customers) throw new Error('Customer not found');

    await customers.destroy();
}

export const updateCustomersBatch = async (customersData) => {
    try {
        const updatedCustomers = [];

        for (const customerData of customersData) {
            const { id, ...updateData } = customerData;
            console.log("Processing customerData:", customerData);

            // Cari customer berdasarkan ID
            const customer = await Customers.findByPk(id);
            if (!customer) {
                throw new Error(`Customer not found with ID ${id}`);
            }

            // Jika ada perubahan pada agen, cek apakah agen tersedia
            if (updateData.agentId) {
                const agent = await Agents.findByPk(updateData.agentId);
                if (!agent) {
                    throw new Error(`Agent not found with ID ${updateData.agentId}`);
                }
            }

            // Lakukan update untuk setiap customer tanpa menggunakan transaksi
            await customer.update(updateData);
            updatedCustomers.push(customer);
        }

        // Kembalikan hasil dalam bentuk JSON
        return updatedCustomers.map(cust => cust.toJSON());

    } catch (error) {
        throw error;
    }
};
