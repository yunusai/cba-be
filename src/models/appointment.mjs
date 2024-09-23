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
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    pesan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    service: {
        type: DataTypes.ENUM('Company Information', 'Legal Document', 'License', 'Other Services'),
        allowNull: false
    },
    consultationType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'On Progress', 'Finished'),
        defaultValue: 'Pending',
        allowNull: false,
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

export default Appointments;
