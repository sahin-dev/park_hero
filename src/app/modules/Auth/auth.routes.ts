import { Router } from "express";
import { AuthController } from "./auth.controllers";
import authMiddleware from "../../middlewares/auth.middleware";


const router = Router()
router.post('/signin', AuthController.handleSignin)
router.post("/signout",authMiddleware(), AuthController.handleSignout)


export default router