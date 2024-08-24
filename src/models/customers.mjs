import { Sequelize } from "sequelize";
import db from "../config/dabatase.mjs";
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
    agent: {
        type:DataTypes.INTEGER,
        references: {model: Agents, key: 'id'},
        allowNull: false
    }
})

Customers.belongsTo(Agents, {foreignKey: 'agentId'});

export default Customers;
