import prisma from "../../db/client";

class ReviewService {


    async giveReview (placeId:string, userId:string, rating:number, text:string){
        const review = await prisma.review.create({data:{rating,text,reviewer_id:userId, parking_place_id:placeId}})

        return review

    }

  
}