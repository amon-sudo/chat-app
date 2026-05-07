import 'dotenv/config'


export const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_KEY:process.env.JWT_KEY,
    RESEND_API:process.env.RESEND_API,
    NODE_ENV:process.env.NODE_ENV,
    EMAIL_FROM:process.env.EMAIL_FROM,
    EMAIL_FROM_NAME:process.env.EMAIL_FROM_NAME,
    CLIENT_URL:process.env.CLIENT_URL,
    CLOUDINARY_KEY:process.env.CLOUDINARY_KEY,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_KEY_SECRET:process.env.CLOUDINARY_API_KEY_SECRET

}