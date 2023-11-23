import { conexionDB } from "../config/conexiondb.js";
import { hashPassword, comparePassword, generarJWT } from "../helpers/functions.js";
import mongoose from "mongoose";
import Admin from "../models/admin.models.js";
import Residencia from "../models/residencia.models.js";
const db = await conexionDB()
const Sudo = db.collection("superAdmin")


export const login = async (req,res) => {
    try {
        const {email,password} = req.body
        
        const existEmail = await Sudo.findOne({email})
        if (!existEmail) return res.status(404).json({error: "Este email no esta registrado"})
        
        const passwordMatches = await comparePassword(password,existEmail.password)
        if (!passwordMatches) return res.status(403).json({error: "Contraseña incorrecta"})

        res.json({token: generarJWT(existEmail._id)})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({serverError: error.message})        
    }
}


export const olvidePassword = async (req,res) => {
    try {
        const {email} = req.body
        
        const existEmail = await Sudo.findOne({email})
        if (!existEmail) return res.status(404).json({error: "Este email no esta registrado"})
        
        res.json({success: "Un email con las instrucciones fue enviado"})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({serverError: error.message})        
    }
}


export const getSudoUser = async (req,res) => {
    try {
        const _id = new mongoose.Types.ObjectId(req.params.sudoId)
        const user = await Sudo.findOne({_id})

        res.json({nombre:user.nombre})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({serverError: error.message})
    }
}


export const getSudoUsers = async (req,res) => {
    try {
        const {sudoId} = req.params
        const sudoUsers = await Sudo.find().toArray()
        
        const isSudo = sudoUsers.find(({_id}) => String(_id) === sudoId)
        if (!isSudo) return res.status(403).json({error: "Accion Prohibida"})

        const SudoUsers = await Sudo.find().toArray();
        res.json(SudoUsers);
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({serverError: error.message})
    }
}


export const updatePassword = async (req,res) => {
    try {
        const {password, newPassword} = req.body
        const _id = new mongoose.Types.ObjectId(req.params.sudoId)

        const user = await Sudo.findOne({_id})
        if (!user) return res.status(403).json({error: "Accion prohibida"})

        const passwordMatches = await comparePassword(password,user.password)
        if (!passwordMatches) return res.status(403).json({error: "Password incorrecto"})

        const hashedPassword = await hashPassword(newPassword)

        const result = await Sudo.updateOne(
            { _id }, 
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount === 1) {
            res.json({ success: "Password Actualizado" });
        } else {
            res.status(404).json({ error: "User not found" });
        }

    } catch (error) {
        res.status(500).json({serverError: error.message})
        console.log(error.message)
    }
}


export const getAdminUsers = async (req,res) => {
    try {
        const {sudoId} = req.params
        const sudoUsers = await Sudo.find().toArray()
        
        const isSudo = sudoUsers.find(({_id}) => String(_id) === sudoId)
        if (!isSudo) return res.status(403).json({error: "Accion Prohibida"})

        const residencias = await Residencia.find()
        
        const admins = await Promise.all(residencias.map(async item => {
            const {nombre:residencia,direccion,barrio,departamento,
            ciudad,propietarios,asistente,contador,revisorFiscal,consejo} = item
            
            const {nombre,email,_id,token,createdAt,agregadoPor} = await Admin.findById(item.adminId)

            return {_id,nombre,email,token,createdAt,agregadoPor,residencia,direccion,
            barrio,departamento,ciudad,propietarios,asistente,contador,revisorFiscal,consejo}
        }))

        res.json(admins)

    } catch (error) {
        res.status(500).json({serverError: error.message})
        console.log(error.message)

    }
}


export const addAdmin = async (req,res) => {
    try {
        const {sudoId, geo} = req.params
        const sudoUsers = await Sudo.find().toArray()

        const isSudo = sudoUsers.find(({_id}) => String(_id) === sudoId)
        if (!isSudo) return res.status(403).json({error: "Accion Prohibida"})

        
        const duplicatedField = async () => {
            const admins = await Admin.find({})
            const data = ["email","direccion"]
            
            for (let document of admins) {
                for (let field of data) {
                    if (document[field] === newAdmin[field]) {
                        return `el campo "${field}" ya esta siendo usado por otro administrador`
                    }
                }
            }
            return null
        }
        
        const isDuplicated = await duplicatedField()
        if (isDuplicated !== null) return res.json({error: `${isDuplicated}`})
        
        const newGeo = new Residencia({
            nombre: req.body.residencia,
            ubicacion: JSON.parse(geo),
            direccion: req.body.direccion,
            barrio: req.body.barrio,
            departamento: req.body.departamento,
            ciudad: req.body.ciudad,
        })
        
        const residencia = await newGeo.save()
        
        const newAdmin = new Admin({
            nombre: req.body.nombre,
            email: req.body.email,
            password: await hashPassword(req.body.password),
            agregadoPor: sudoId,
            residenciaId: newGeo._id
        });

        await newAdmin.save()

        residencia.adminId = newAdmin._id
        await residencia.save()

        res.json({success: "Administrador agregado"})
        
    } catch (error) {
        res.status(500).json({serverError: error.message})
        console.log(error.message)
    }
}


export const deleteAdmin = async (req,res) => {
    try {
        const {sudoId, adminId} = req.params
        const sudoUsers = await Sudo.find().toArray()
        
        const isSudo = sudoUsers.find(({_id}) => String(_id) === sudoId)
        if (!isSudo) return res.status(403).json({error: "Accion Prohibida"})

        const admin = await Admin.findByIdAndDelete(adminId).where({
            agregadoPor: sudoId
        })

        if (!admin) return res.status(404).json({error: "El admin solo puede ser eliminado por quien fue agregado"})

        res.json({succes: "Admin eliminado"})

    } catch (error) {
        res.status(500).json({serverError: error.message})
        console.log(error.message)

    }
}


export const updateAdmin = async (req,res) => {
    try {
        const {sudoId,adminId} = req.params
        const sudoUsers = await Sudo.find().toArray()
        
        const isSudo = sudoUsers.find(({_id}) => String(_id) === sudoId)
        if (!isSudo) return res.status(403).json({error: "Accion Prohibida"})

        const keysInvalidos = () => {
            const data = ["nombre","email","password"]
            const bodyKeys = Object.keys(req.body)

            return bodyKeys.every(key => {
                return data.includes(key)
            })
        }

        const validKey = keysInvalidos()
        if (!validKey) return res.status(403).json({error: "Se agregaron propiedades invalidas"})

        if (req.body?.password) {
            req.body.password = await hashPassword(req.body.password)   
        }

        await Admin.findByIdAndUpdate(adminId,req.body)

        res.json({success: "Admin Actualizado"})

    } catch (error) {
        res.status(500).json({serverError: error.message})
        console.log(error.message)

    }
}



export const accessProfile = async (req,res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log(error.message)
    }
}