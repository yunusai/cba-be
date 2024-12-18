import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'
// import Agents from '../models/agents.mjs';
// import Products from '../models/products.mjs';
// import Appointments from '../models/appointment.mjs';
// import Customers from '../models/customers.mjs';
// import TransactionDetails from '../models/transactionDetails.mjs';
// import TransactionFinals from '../models/transactionFinals.mjs';
// import Countries from '../models/countries.mjs';
// import Variations from '../models/productVariations.mjs';

dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: console.log
});


// Function to load models
// const initializeModels = (sequelize) => {
//     Agents(sequelize);
//     Products(sequelize);
//     Variations(sequelize);
//     Appointments(sequelize);
//     Customers(sequelize);
//     TransactionDetails(sequelize);
//     TransactionFinals(sequelize)
//     Countries(sequelize)
// }


// initializeModels(db);



export default db
