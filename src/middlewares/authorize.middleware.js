/* eslint-disable no-undef */
import { ApiError } from "../utils/ApiError.js"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
const authorize = async(req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || (req.header('Authorization')?.startsWith('Bearer ') ? req.header('Authorization').slice(7).trim() : null)
        if(!token){
            throw new ApiError(401,'Unauthorized requrest')
        }
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id).select('-password -refreshToken')
        if(!user){
            throw new ApiError('Invalid Access Token')
        }
        req.user = user;
        next()
    }
    catch(error){
        throw new ApiError(401,error?.message || "Invalid access Token")
    }
}
export {authorize}