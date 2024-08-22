import { Sequelize } from "sequelize";
import db from "../config/dabatase.mjs";

const {DataTypes} = Sequelize;

const Appointments = db.define('appointments', {
    name: {
        type: DataTypes.STIRNG,
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
    pesam: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'On Progress', 'Finished'),
        defaultValue: 'Pending',
        allowNull: false,
    }
})

export default Appointments;
