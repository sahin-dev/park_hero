import prisma from "../../db/client";

export class ReviewService {


    async createReview (placeId:string, userId:string, rating:number, text:string){
        const review = await prisma.review.create({data:{rating,text,reviewer_id:userId, parking_place_id:placeId}})

        return review

    }

    async getPlaceReviews (placeId:string){
        const reviews = await prisma.review.findMany({where:{parking_place_id:placeId}, include:{reviewer:{select:{avatarUrl:true, }}}})

        return reviews
    }

  
}