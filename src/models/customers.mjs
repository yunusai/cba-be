import { Sequelize } from "sequelize";
import db from "../config/database.mjs";
import Agents from "./agents.mjs";

const {DataTypes} = Sequelize;

const Customers = db.define('customers',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    identity_type:{
        type: DataTypes.STRING,
        allowNull: false
    },
    identity_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    place_of_birth: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER
    },
    nationality: {
        type: DataTypes.STRING,
    },
    agentId: {
        type:DataTypes.INTEGER,
        allowNull: false
    }
})


export default Customers;
