/* eslint-disable no-undef */
import mongoose from 'mongoose'
const connectDB = async()=>{
    try{
        const response = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log('Mongodb connectd successfully at host: ',response.connection.host)
    }
    catch(error){
        console.log('Mongodb connection Error:',error)
        process.exit(1)
    }
    }
    export {connectDB}
