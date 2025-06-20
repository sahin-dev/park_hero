import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { ReviewController } from "./review.controller";

const router = Router()


router.route("/:placeId").post(authMiddleware(), ReviewController.createReview).get(authMiddleware(), ReviewController.getPlaceReviews)


export const reviewRoutes = router