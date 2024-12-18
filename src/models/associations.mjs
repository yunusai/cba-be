import Agents from './agents.mjs';
import Customers from './customers.mjs';
import Products from './products.mjs';
import Variations from './productVariations.mjs';
import TransactionDetails from './transactionDetails.mjs';
import TransactionCustomers from './transactionCustomers.mjs';
import Countries from './countries.mjs';
import Categories from './categories.mjs';

// Definisikan relasi setelah semua model diimpor

// Relasi antara Agents dan Customers
Agents.hasMany(Customers, { foreignKey: 'agentId' });
Customers.belongsTo(Agents, { foreignKey: 'agentId' });
// Relasi antara Customers dan TransactionDetails melalui TransactionCustomer

Customers.belongsToMany(TransactionDetails, {
    through: TransactionCustomers,
    foreignKey: 'customerId',
});
TransactionDetails.belongsToMany(Customers, {
    through: TransactionCustomers,
    foreignKey: 'transactionId',
});


// Relasi antara Products dan TransactionDetails
Variations.hasMany(TransactionDetails, { foreignKey: 'variationId' });
TransactionDetails.belongsTo(Variations, { foreignKey: 'variationId' });

//Relasi antara Countries dan Customers
Countries.hasMany(Customers, { foreignKey: 'countryId', as: 'countryData' });
Customers.belongsTo(Countries, { foreignKey: 'countryId', as: 'countryData' });

Countries.hasMany(Customers, { foreignKey: 'emergencyContactCountryId', as: 'emergencyContactCountry' });
Customers.belongsTo(Countries, { foreignKey: 'emergencyContactCountryId', as: 'emergencyContactCountry' });

//Relasi antara Categories dan Product
Categories.hasMany(Products, { foreignKey: 'categoryId' });
Products.belongsTo(Categories, { foreignKey: 'categoryId' })

//Relasi antara Variations dan Product
Variations.belongsTo(Products, { foreignKey: 'productId' })
Products.hasMany(Variations, { foreignKey: 'productId' });




export { Agents, Customers, Products, TransactionDetails, TransactionCustomers, Countries, Categories, Variations };
