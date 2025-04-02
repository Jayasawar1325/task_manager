import mongoose,{Schema} from 'mongoose'
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
export const User = mongoose.model('User',userSchema)