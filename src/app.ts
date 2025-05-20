import express from 'express'
import cors from 'cors'
import routes from './app/routes'
import dotenv from 'dotenv'
import GlobalErrorHandler from './app/middlewares/error.middleware'
dotenv.config()

const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes)

app.use(GlobalErrorHandler);

export default app