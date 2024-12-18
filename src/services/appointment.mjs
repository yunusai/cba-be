import Appointments from "../models/appointment.mjs";
import path from "path";
// import fs from 'fs';
// import multer from "multer";

// // Buat folder uploads jika belum ada
// const uploadDir = 'appointments-proposal/';
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// // setup multer untuk file upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir); // Direktori untuk menyimpan file
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname); // Menggunakan nama asli file
//     }
// });

// export const upload = multer({ storage: storage });

export const createAppointment = async (appointmentData) => {
    try {
        const appointment = await Appointments.create({
            ...appointmentData,
            status: "Waiting" // Status default saat pembuatan appointment
        });
        return appointment.toJSON();
    } catch (error) {
        throw new Error('Failed to create appointment: ' + error.message);
    }
}


export const deleteAppointment = async (id) => {
    try {
        const appointment = await Appointments.findByPk(id);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        await appointment.destroy();
        return { message: 'Appointment deleted successfully' };
    } catch (error) {
        throw new Error('Failed to delete appointment: ' + error.message);
    }
};

export const getAllAppointments = async () => {
    try {
        const appointment = await Appointments.findAll()
        return appointment.map(appointment => appointment.toJSON())
    } catch (error) {
        throw new Error('Failed to fetch appointments: '+error.message)
    }
}

export const getAppointmentById = async (id) => {
    try {
        const appointment = await Appointments.findByPk(id);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment.toJSON();
    } catch (error) {
        throw new Error('Failed to fetch appointment: ' + error.message);
    }
};

export const updateAppointmentStatus = async (id, status) => {
    try {
        const appointment = await Appointments.findByPk(id);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        appointment.status = status;
        await appointment.save();
        return appointment.toJSON();
    } catch (error) {
        throw new Error('Failed to update appointment status: ' + error.message);
    }
};
