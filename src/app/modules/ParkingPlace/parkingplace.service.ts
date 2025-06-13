import prisma from "../../db/client"
import { IParkingData } from "./parkingplace.interface"


const getParkingPlaces  = async ()=>{
    
    const places = await prisma.parkingPlace.findMany()

    return places
}

const getUserparkingPlaces = async (userId:string)=>{

    const places  = await prisma.parkingPlace.findMany({where:{owner_id:userId}})

    return places
}

const getParkingdetails = async (placeId:string)=>{
    const details = await prisma.parkingPlace.findUnique({where:{id:placeId}})

    return details


}

const getParkingSpots = async (placeId:string)=>{

    const spots = await prisma.parkingSpot.findMany({where:{parking_place_id:placeId}})

    return spots
}

const updateParkingDetails = async (placeId:string, data:IParkingData)=>{

}


const addToFavourite = async (userId:string, placeId:string)=>{

    const favourite = await prisma.favourite.create({data:{user_id:userId, parking_place_id:placeId}})

    return favourite
}