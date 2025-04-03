import { Router } from "express";
import { loginUser,logoutUser,registerUser } from "../controllers/auth.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const authRouter = Router()
authRouter.route('/register').post(upload.fields([{
    name:'avatar',
    maxCount:1
}]),registerUser)
authRouter.route('/login').post(authorize,loginUser)
authRouter.route('/logout').post(authorize,logoutUser)
export {authRouter}