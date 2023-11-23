import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { conexionDB } from "../config/conexiondb.js";
const db = await conexionDB()
const Sudo = db.collection("superAdmin")

export const authUser = async (req,res,next) => {
    try {
        const {authorization} = req.headers
        if (authorization.startsWith("Bearer") && authorization) {
            
            const token = authorization.split(" ")[1]
            const {id} = jwt.verify(token, process.env.SECRET_KEY)
            const _id = new mongoose.Types.ObjectId(id)
            
            const existUser = await Sudo.findOne({_id}, { projection: { password: 0 } });

            if (!existUser) return res.status(404).json({error: "Token invalido"})

            req.user = existUser
            next()
        } else {
            res.status(404).json({error: "Token invalido o inexistente"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({serverError: error.message})
    }
}