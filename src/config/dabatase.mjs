//import mysql from 'mysql2'
import { Sequelize } from 'sequelize';

// const db = new Sequelize('cba-node', 'root', 'SQLserVer123', {
//     host: 'localhost',
//     dialect: 'mysql'
// })


// const db = new Sequelize('cbaf5568_backend_api', 'cbaf5568_juan', 'juan100', {
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306
// });

const db = new Sequelize('cbaf5568_wp442', 'cbaf5568_wp442', '!6SpMD348@', {
    host: '203.175.9.136',
    dialect: 'mysql',
    port: 3306
});

//203.175.9.136
//malintang.iixcp.rumahweb.net
// const dbPool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: 'root',
//     password: 'SQLserVer123',
//     database: 'cba-node'
// }).promise();

export default db
