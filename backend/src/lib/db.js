import mongoose from 'mongoose'


export const connectDB = async() => {
    try{
      const conn =  await mongoose.connect(process.env.MONGO_URI)
      console.log("MONGOOSE CONNECTED", conn.connection.host)

    } catch(error){
        console.error("Error connection to MONGO", error)
        process.exit(1)  //1 means failed and 0 means success
    }
}