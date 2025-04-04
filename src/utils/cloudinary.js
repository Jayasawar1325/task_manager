/* eslint-disable no-undef */
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary= async(localFilePath)=>{
    try{
        const result = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        fs.unlinkSync(localFilePath)
        return result;
        
    }
    catch(err){
        fs.unlinkSync(localFilePath)
        console.log(err)
    }
}
export {uploadOnCloudinary}