import mongoose from "mongoose";
import {randomUUID} from "crypto"

const adminSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,    
    },
    token: {
        type: String,
        default: randomUUID()
    },
    agregadoPor: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    residenciaId: {
        type: mongoose.SchemaTypes.ObjectId,
    }
},{
    versionKey: false,
    timestamps: true
})





export default mongoose.model("Admin", adminSchema)