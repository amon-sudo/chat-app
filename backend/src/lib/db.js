import mongoose from 'mongoose'
import { ENV } from './env.js'

export const connectDB = async() => {
    try{
      const {MONGO_URI} = ENV
      if(!MONGO_URI) throw new Error("MONGO_URI is not set")
      const conn =  await mongoose.connect(process.env.MONGO_URI)
      console.log("MONGOOSE CONNECTED", conn.connection.host)

    } catch(error){
        console.error("Error connection to MONGO", error)
        process.exit(1)  //1 means failed and 0 means success
    }
}