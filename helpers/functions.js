import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const hashPassword = async password => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password,hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

export const generarJWT = id => {
    return jwt.sign({id},process.env.SECRET_KEY,{
        expiresIn: "7d"
    })
}
