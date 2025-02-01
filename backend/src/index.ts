import express, { urlencoded } from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"

import faq from "./router/faq-router"

dotenv.config()




const mongoURI = process.env.MONGO;

if (!mongoURI) {
  throw new Error('MONGO environment variable is not defined');
}

console.log(mongoURI);

mongoose.connect(mongoURI)
  .then(() => console.log('Connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use("/api/v1/faq", faq);

app.listen(port, () => {
  console.log(`on port :${port}`);
});