import { Sequelize } from "sequelize";
import db from "../config/database.mjs";


const {DataTypes} = Sequelize;

const Customers = db.define('customers',{
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    motherName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nationality: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originalCity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originalProvince: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    countryId: { //harus buat parameter country
        type: DataTypes.INTEGER,
        allowNull: false
    },
    indonesiaAccomodationName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    indonesiaAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emergencyContactFullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emergencyContactRelation: {
        type: DataTypes.ENUM('Parent','Grandparent','Brother/Sister','Other'),
        allowNull: false
    },
    emergencyContactAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emergencyContactCountryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    emergencyContactEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emergencyContactMobilePhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    travelDocument: {
        type: DataTypes.ENUM('Passport'),
        allowNull: false
    },
    documentNumber:{
        type: DataTypes.STRING,
        allowNull: false
    },
    agentId: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    passport: {
        type: DataTypes.STRING,
        allowNull: true
    },
    visa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    docPendukung: {
        type: DataTypes.STRING,
        allowNull: true
    }
})


export default Customers;
