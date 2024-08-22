import { Sequelize } from "sequelize"
import db from "../config/dabatase.mjs"

const { DataTypes } = Sequelize;

const Agents = db.define('agents', {
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refreshToken: {
        type: DataTypes.TEXT
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
    freezeTableName:true
});

export default Agents
