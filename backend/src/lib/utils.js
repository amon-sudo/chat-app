import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId:userId}, process.env.JWT_KEY, {
        expiresIn: "7d",
    })
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, //in ms
        httpOnly: true, // prevents attacks
        sameSite:"strict",
        secure: process.env.NODE_ENV =="development"? false : true

    })
    return token
}