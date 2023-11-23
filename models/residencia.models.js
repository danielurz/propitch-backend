import mongoose from "mongoose";

const residenciaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        unique: true
    },
    ubicacion: {
        lat: {type:Number, required: true},
        lng: {type:Number, required: true}
    },
    direccion: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    barrio: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    departamento: {
        type: String,
        required: true,
        trim: true    
    },
    ciudad: {
        type: String,
        required: true,
        trim: true    
    },
    adminId: {
        type: mongoose.SchemaTypes.ObjectId
    },
    propietarios: [
        {
            type: mongoose.SchemaTypes.ObjectId
        }
    ],
    asistente: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    },
    contador: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    },
    revisorFiscal: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    },
    consejo: [
        {
            type: mongoose.SchemaTypes.ObjectId
        }
    ]
},{
    timestamps: true,
    versionKey: false
})

export default mongoose.model("Residencia", residenciaSchema)