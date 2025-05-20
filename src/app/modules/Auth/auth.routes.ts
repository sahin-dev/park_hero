import { Router } from "express";
import { AuthController } from "./auth.controllers";


const router = Router()
router.post('/signin', AuthController.handleSignin)


export default router