import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

const {DataTypes} = Sequelize;

const Appointments = db.define('appointments', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateAppointment: {
        type: DataTypes.DATE,
        allowNull: false
    },
    pesan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    service: {
        type: DataTypes.ENUM('Immigration', 'Legal'),
        allowNull: false
    },
    consultationType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {  // Kolom status
        type: DataTypes.ENUM('Waiting', 'Cancelled', 'Success'),
        allowNull: true
    },

})

export default Appointments;
