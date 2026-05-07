import { v2 as cloudinary } from "cloudinary";

import { ENV } from "./env.js";


cloudinary.config({
    CLIENT_URL:ENV.CLIENT_URL,
    CLOUDINARY_KEY: ENV.CLOUDINARY_KEY,
    CLOUDINARY_API_KEY:ENV.CLOUDINARY_API_KEY,
    CLOUDINARY_API_KEY_SECRET:ENV.CLOUDINARY_API_KEY_SECRET   
})

export default cloudinary