import { Sequelize } from "sequelize"
import db from "../config/database.mjs"

const { DataTypes } = Sequelize;

const Agents = db.define('agents', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
    freezeTableName:true
});


export default Agents
