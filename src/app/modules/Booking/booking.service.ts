import { BookingStatus } from "../../../generated/prisma"
import prisma from "../../db/client"




const bookSpot = async (userId:string,spotId:string)=>{

    const booking = await prisma.booking.create({data:{user_id:userId, spot_id:spotId}})

    return booking

}


const getBookings = async (placeId:string)=>{
    const bookings = await prisma.parkingSpot.findMany({where:{parking_place_id:placeId, parkingBookings:{every:{status:BookingStatus.ACTIVE}}}, include:{parkingBookings:true}})
    return bookings
}


export const bookingService = {
    bookSpot,
    getBookings
}