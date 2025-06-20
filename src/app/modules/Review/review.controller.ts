import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service"
import { Response } from "express";

export class ReviewController {


    private static reviewSerivce:ReviewService;

    constructor() {
        ReviewController.reviewSerivce = new ReviewService();
    }

    static async createReview(req:any, res:Response){
        const user = req.user;
        const {placeId} = req.params
        const {rating, text} = req.body

     
        const result = await this.reviewSerivce.createReview(placeId, user.id, rating, text);

        sendResponse(res, {
            success:true,
            statusCode:httpStatus.CREATED,
            message:"Review submitted successfully",
            data:result
        })
    }

   static async getPlaceReviews (req:any, res:Response){
        const {placeId} = req.params

        const reviews = await ReviewController.reviewSerivce.getPlaceReviews(placeId);

            sendResponse(res, {
            success:true,
            statusCode:httpStatus.OK,
            message:"Reviews fetched successfully",
            data:reviews
        })

    }


}