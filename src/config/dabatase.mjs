import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT
});

//Function to load models
const loadModels = (sequalize, dirname) => {
    fs.readdirSync(dirname)
        .filter(file => file.endsWith('.mjs'))
        .forEach(file => {
            const model = require(path.join(dirname, file));
            model(sequalize);
        })
}

loadModels(db, path.resolve(__dirname, '../models'));


//203.175.9.136
//malintang.iixcp.rumahweb.net
// const dbPool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: 'root',
//     password: 'SQLserVer123',
//     database: 'cba-node'
// }).promise();

export default db
