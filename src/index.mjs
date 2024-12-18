import express from 'express'
import db from './config/database.mjs';
import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 5000;
import cookieParser from 'cookie-parser';
import cors from 'cors'
import router from './routes/index.mjs';
import swaggerSpec from './config/swagger.mjs';
import swaggerUi from 'swagger-ui-express'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//Midlleware for swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use(router);
app.use(express.static(path.join(__dirname, '../.')));


try {
    await db.authenticate();
    console.log('Database Connected...')
    await db.sync({ alter: true }); //to automate generate
} catch (error) {
    console.error(error.message);
}
app.listen(3000, () => {
    console.log(`Running on Port ${3000}`);
})
