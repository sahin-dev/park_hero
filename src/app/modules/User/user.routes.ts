import { Router } from "express";
import { userController } from "./user.controllers";
import { register } from "ts-node";
import { fileUploader } from "../../../helpers/multer";
import authMiddleware from "../../middlewares/auth.middleware";



const router = Router()

router.post('/register', userController.register)
router.post('/', authMiddleware(), userController.updateUser)
router.route("/favourite").post(authMiddleware(), )

router.post('/add/info',authMiddleware(), fileUploader.uploadAvatar, userController.addInformation)
router.post("/add/vehicle", authMiddleware(), userController.addVehicle)
router.post('/forget-password', userController.fogetpassword)
router.post("/verify", userController.verifyOtp)
router.post("/toggole-favourite/:placeId", authMiddleware(),userController.toggoleFavourite)


export const userRoutes =  router