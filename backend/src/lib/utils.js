import jwt from 'jsonwebtoken'
import { ENV } from './env.js'
export const generateToken = (userId, res) => {
    const {JWT_KEY} = ENV
    if(!JWT_KEY) throw new Error("no JWT KEY found")
    const token = jwt.sign({userId:userId}, JWT_KEY, {
        expiresIn: "7d",
    })
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, //in ms
        httpOnly: true, // prevents attacks
        sameSite:"strict",
        secure: ENV.NODE_ENV =="development"? false : true

    })
    return token
}