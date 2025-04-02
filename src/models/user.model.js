/* eslint-disable no-undef */
import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
const userSchema = new Schema({
name:{
    type:String,
    required:[true,'Username is required'],
    minLength:5
},
email:{
    type:String,
    required:[true,'Email is required'],
    lowercase:true,
    unique:true,
    match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
},
password:{
    type:String,
    required:[true,'Password is required'],
    minLength:6
},
avatar:{
    type:String,
    required:[true,'Avatar is required']
}
},{timestamps:true})
userSchema.methods.generateAccesToken= function(){
    return jwt.sign({
        _id:_id,
        email:email
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefeshToken = function(){
    return jwt.sign({
        _id:_id,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)

}
export const User = mongoose.model('User',userSchema)




