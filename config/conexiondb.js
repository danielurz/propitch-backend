import mongoose from "mongoose";

export const conexionDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB conectado en el puerto ${db.connection.port}`)
        return db.connection
        
    } catch (error) {
        console.log(`Error al conectarse a la DB: ${error.message}`)
        process.exit(1)
    }
}