import { generateToken } from '../lib/utils.js'
import User from '../models/User.js'
import bcrypt from 'bcrypt'

export const signup =  async(req, res) => {
 const {fullName, email, password} = req.body

 try{
    if (!fullName || !email || !password){
        return res.status(400).json({"message":"All fieldsare required"})
    }
    if (password.length < 6) {
        return res.status(400).json({"message":"Password must be f lenght mre than 6"})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)){
        return res.status(400).json({"message":"Enter valid email"})
    }

    const user = await User.findOne({email})
    if (user) return res.status(400).json({"message":"User with the email already exists"})
    //  password hashing using bcrypt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = User({
        fullName,
        email,
        password: hashedPassword
    })

    if (newUser){
        generateToken(newUser._id, res)
        await newUser.save()
        res.status(201).json({
            _id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        })

        // send a welcome email
    }
    else{
        return res.status(400).json({"message":"Invalid user"})
    }

 } catch(error){
    console.log("there was a problem in auth controller", error)
    res.status(500).json({"message":"server failed"})

 }
}