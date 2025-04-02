import { Router } from "express";
import { loginUser,logoutUser,registerUser } from "../controllers/auth.controller";
const authRouter = Router()
authRouter.route('/register').post(registerUser)
authRouter.route('/register').post(loginUser)
authRouter.route('/register').post(logoutUser)
export {authRouter}