import express from "express"
import dotenv from "dotenv"
import { conexionDB } from "./config/conexiondb.js"
import cors from "cors"
import sudoRouter from "./routes/sudo.routes.js"

const app = express()
app.use(express.json())
app.use(cors())
app.use(dotenv.config())
conexionDB()

app.use("/api/sudo", sudoRouter) 

const server = app.listen(process.env.PORT, () => {
    const address = server.address();
    const host = address.address === '::' ? 'localhost' : address.address;
    const port = address.port;
    console.log(`Server listening at http://${host}:${port}`);
});