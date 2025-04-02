/* eslint-disable no-undef */
import express from 'express'
import { connectDB } from './db/index.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config({
    path:'./.env'
})
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

// Routes
import { authRouter } from './routes/auth.routes.js'
app.use('/api/v1/auth',authRouter)

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
    })
})
.catch((error)=>[
    console.log('Error while connecting to database:',error)
])