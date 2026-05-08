import { text } from "express";
import mongoose from "mongoose";
import User from "./User.js";

const messageShema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    text : {
        type: String
    },
    image: {
        type: String
    }
},
    {timestamps: true}
)

const message = mongoose.model("Message", messageShema)

export default message