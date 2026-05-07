import { sendWelcomeEmail } from '../emails/emailHandlers.js'
import { generateToken } from '../lib/utils.js'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { ENV } from '../lib/env.js'
import cloudinary from '../lib/cloudinary.js'

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
        const saveUser = await newUser.save()
        generateToken(saveUser._id, res)
        res.status(201).json({
            _id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        })

        // send a welcome email
        try{
            await sendWelcomeEmail(saveUser.email, saveUser.fullName, ENV.CLIENT_URL)
        } catch(error){
            console.error("Failed to send a welcome email", error)
            throw new Error("welcome email failed")
        }
    }
    else{
        return res.status(400).json({"message":"Invalid user"})
    }

 } catch(error){
    console.log("there was a problem in auth controller", error)
    res.status(500).json({"message":"server failed"})

 }
}

export const login = async(req, res) => {
    const {email, password} = req.body

    try{
        if (!email || !password) return res.status(400).json({ message: "Email and password are required" })

        const user = await User.findOne({email})
        if (!user) return res.status(400).json({message:"Invalid credentials"}) // never say what is missing, best practises
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"}) 
        generateToken(user.id, res)
        res.status(201).json(
            
            [
                {message:"Logged in successfully"},
                {
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        }])
    } catch(error){
        console.error("Error in the login controller",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const logout = (req, res) => {
    res.cookie("jwt", "", {maxAge:0})
    res.status(200).json({message:"LOgged out successfully"})
}

export const updateProfile = async(req, res) => {
    try {
        const {profilePic} = req.body
        if (!profilePic) return res.status(400).json({message:"You have no profile"})
        const userId = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.error("Problem in the update profile", error)
        res.status(500).json({message:"Internal server error"})
    }
}