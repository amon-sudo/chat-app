import express from 'express'
import dotenv from 'dotenv'
import authRouters from './routes/auth.routes.js' 
import messageRouters from './routes/messages.routes.js'
import path from 'path'
import cookieParser from 'cookie-parser'
import { connectDB } from './lib/db.js'
import { ENV } from './lib/env.js'

const app = express()
const __dirname = path.resolve()

const PORT = ENV.PORT
console.log(ENV.PORT)
app.use(express.json()) //req.body
app.use(cookieParser())


app.use('/api/auth', authRouters)
app.use('/api/messages', messageRouters)


// ready for deplayment

if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (req, res)=> {
        res.sendFile(path.join(__dirname, '../frontend','dist', 'index.html'))
    })
}



app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    connectDB()
})