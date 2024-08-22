import express from 'express'
import db from './config/dabatase.mjs';
import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 5000;
import cookieParser from 'cookie-parser';
import cors from 'cors'


const app = express();

app.use(cors())
app.use(cookieParser())
app.use(express.json());

try {
    await db.authenticate();
    console.log('Database Connected...')
    //await db.sync(); //to automate generate
} catch (error) {
    console.error(error.message);
}
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})
