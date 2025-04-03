/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import bcrypt from 'bcryptjs'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        throw new ApiError(404, "User not found"); // ✅ Ensure user exists
      }
  
      const accessToken = user.generateAccessToken(); // ✅ Now correctly defined
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Token Generation Error:", error); // ✅ Log error for debugging
      throw new ApiError(500, "Something went wrong while generating access and refresh Token");
    }
  };
  

export const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password}= req.body;
    if(!(name || email || password )){
        throw new ApiError(400,'All fields are required')
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new ApiError(400,'User already exists')
    }
    const salt =await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const avatarLocalPath =req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,'Avatar file path is missing')
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError(400,'Avatar is required')
    }
  
    const user = await User.create({
        name,
        password:hashedPassword,
        email,
        avatar:avatar.url
    })
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
     res.status(200)
    .json({
        message:'User registered successfully',
        success:true,
        data:{user,accessToken, refreshToken}
    })
    })
export const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!(email || password)){
        throw new ApiError(400,'Email and password are required')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404,'User not found')
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        throw new ApiError(400,'Password doesnot match')
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser= await User.findById(user._id).select('-password')
    const options ={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json({
        message:'User logged In successfully',
        success:true,
        data:{
            loggedInUser
        }
    })
    
})
export const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken:1
        }
    },{
        new:true
    })
    const options ={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json({
        message:'User logged out successfully',
        success:true,
        data:{}
    })

})