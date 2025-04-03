/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import bcrypt from 'bcryptjs'
import { aj } from "../utils/arcjet.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        throw new ApiError(404, "User not found"); 
      }
  
      const accessToken = user.generateAccessToken(); 
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Token Generation Error:", error); 
      throw new ApiError(500, "Something went wrong while generating access and refresh Token");
    }
  };
  

export const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password}= req.body;
    if(!(name || email || password )){
        throw new ApiError(400,'All fields are required')
    }
       // Arcjet Email Validation
       const decision = await aj.protect(req, { email });
       if (decision.isDenied()) {
           throw new ApiError(400, "Invalid or disposable email");
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
    export const loginUser = asyncHandler(async (req, res) => {
    
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }
    
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(400, 'Password does not match');
        }
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select('-password');
    
        const options = {
            httpOnly: true,
            secure: true,
        };
    
        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                message: 'User logged in successfully',
                success: true,
                data: loggedInUser,
            });
    });
    
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
export const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?.id)
    const isPasswordCorect =  bcrypt.compare(oldPassword,user.password);
    if(!isPasswordCorect){
        throw new ApiError(400,'Invalid old Password')
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false})
    return res.status(200)
    .json({
        message:'Password changed successfully',
        success:true,
        data:{}
    })
})
export const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {name,email} = req.body;
    if(!(name ||email)){
        throw new ApiError(400,'All fields are required')
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            name,
            email
        }
    },{
        new:true
    }).select('-password')
    return res.status(200)
    .json({
        message:"User account updated successsfully",
        success:true,
        data:user
    })
})
export const updateUserAvatar = asyncHandler(async (req, res) => {


    if (!req.file) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatarLocalPath = req.file.path;
    console.log("Avatar Local Path:", avatarLocalPath);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar || !avatar.url) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: { avatar: avatar.url },
    }, { new: true });

    return res.status(200).json({
        message: "Avatar updated successfully",
        success: true,
        data: user,
    });
});


export const getUsers =  asyncHandler(async(req,res)=>{
 const users = await User.find();
 return res.status(200)
 .json({
    data:users,
    message:'Get all users successfully'
 })
})
export const getUser = asyncHandler(async(req,res)=>{
    if (!req.user || !req.user._id) {
        throw new ApiError(401, 'Unauthorized access');
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return res.status(200)
    .json({
        message: 'Get user successfully',
        data: user
    });
})