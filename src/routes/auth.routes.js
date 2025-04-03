import { Router } from "express";
import { changePassword, getUser, getUsers, loginUser,logoutUser,registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/auth.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const authRouter = Router()
authRouter.route('/register').post(upload.fields([{
    name:'avatar',
    maxCount:1
}]),registerUser)
authRouter.route('/login').post(authorize,loginUser)
authRouter.route('/logout').post(authorize,logoutUser)
authRouter.route('/change-password').post(authorize,changePassword)
authRouter.route('/update-account').patch(authorize,updateAccountDetails)
authRouter.route('/change-avatar').patch(authorize,upload.single('avatar'),updateUserAvatar)
authRouter.route('/users').get(getUsers)
authRouter.route('/user/:id').get(getUser)
export {authRouter}