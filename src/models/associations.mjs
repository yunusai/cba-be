import Agents from './agents.mjs';
import Customers from './customers.mjs';
import Products from './products.mjs';
import TransactionDetails from './transactionDetails.mjs';
import Countries from './countries.mjs';
import Categories from './categories.mjs';

// Definisikan relasi setelah semua model diimpor

// Relasi antara Agents dan Customers
Agents.hasMany(Customers, { foreignKey: 'agentId' });
Customers.belongsTo(Agents, { foreignKey: 'agentId' });

// Relasi antara Customers dan TransactionDetails
Customers.hasMany(TransactionDetails, { foreignKey: 'customerId' });
TransactionDetails.belongsTo(Customers, { foreignKey: 'customerId' });

// Relasi antara Products dan TransactionDetails
Products.hasMany(TransactionDetails, { foreignKey: 'productId' });
TransactionDetails.belongsTo(Products, { foreignKey: 'productId' });

//Relasi antara Countries dan Customers
Countries.hasMany(Customers, { foreignKey: 'countryId', as: 'countryData' });
Customers.belongsTo(Countries, { foreignKey: 'countryId', as: 'countryData' });

Countries.hasMany(Customers, { foreignKey: 'emergencyContactCountryId', as: 'emergencyContactCountry' });
Customers.belongsTo(Countries, { foreignKey: 'emergencyContactCountryId', as: 'emergencyContactCountry' });

//Relasi antara Categories dan Product
Categories.hasMany(Products, {foreignKey: 'categoryId'});
Products.belongsTo(Categories, {foreignKey: 'categoryId'})

export { Agents, Customers, Products, TransactionDetails, Countries };
