

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/User.js";


export const getAllContacts = async(req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filiterdUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")
        res.status(200).json(filiterdUsers)
    } catch (error) {
        console.error("Error in getAllContacts", error)
        res.status(500).json({message:"Server error"})
    }
}

export const getMessageByUserId = async(req, res) => {
    try{
        const myId = req.user._id
        const {id:userToChartId} = req.params
        const messages = await Message.find({
            // me to you
            // you to me
            $or:[
                {senderId: myId, receiverId:userToChartId},
                {senderId: userToChartId, receiverId:myId}
            ]
            
        })
        res.status(200).json(messages)
    } catch(error) {
        console.log("Error in getmessageBy id", error)
        res.status(500).json({message:"Server failed"})


    }
}

export const sendMessage = async(req, res) => {
    try {
        const {text, image} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id

               if (!text?.trim() && !image) {
           return res.status(400).json({ message: "Message must contain text or image" })
       }
       if (!mongoose.isValidObjectId(receiverId)) {
           return res.status(400).json({ message: "Invalid receiver id" })
       }
       if (receiverId === senderId.toString()) {
           return res.status(400).json({ message: "Cannot send messages to yourself" })
      }


        let imageUrl;
        if (image){
            //uploading the base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,


        })
        await newMessage.save()

        //send message in real time

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Erro in the sendMesage route", error)
        res.status(500).json({message:"Serveer failed"})
    }
}


export const getChatPatners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        // find all the users where the logged-in user is either the sender or receiver
        const messages = await Message.find({
            $or: [{senderId:loggedInUserId },{receiverId:loggedInUserId}]
        })

        const chatPartnerIds = [
            ...new Set(messages.map((msg) => 
                msg.senderId.toString() === loggedInUserId.toString()
             ? msg.receiverId.toString() 
             : msg.senderId.toString()))]

        const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password")
        res.status(200).json(chatPartners)
    } catch (error) {
        console.log("Error in the getChatPatner controller", error)
        res.status(500).json({error:"Server has failed"})
        
    }
}