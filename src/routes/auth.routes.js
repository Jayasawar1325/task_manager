import { Router } from "express";
import { loginUser,logoutUser,registerUser } from "../controllers/auth.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
const authRouter = Router()
authRouter.route('/register').post(upload.fields([{
    name:'avatar',
    maxCount:1
}]),registerUser)
authRouter.route('/register').post(loginUser)
authRouter.route('/register').post(logoutUser)
export {authRouter}