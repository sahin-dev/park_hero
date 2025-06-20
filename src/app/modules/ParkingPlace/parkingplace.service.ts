import { PlaceStatus } from "../../../generated/prisma"
import prisma from "../../db/client"
import ApiError from "../../errorr/ApiError"
import { IParkingCreate, IParkingUpdate } from "./parkingplace.interface"


const createParkingPlace = async (userId:string, placeData:IParkingCreate)=>{

    const place = await prisma.parkingPlace.create({data:{...placeData, ownerId:userId}})

    for (let i = 0;i<place.totalSpots;i++){
        await prisma.parkingSpot.create({data:{parking_place_id:place.id,spot_name:`${i+1}P`}})
    }

    return place
 
}


const getParkingPlaces  = async ()=>{
    
    const places = await prisma.parkingPlace.findMany()

    return places
}

const getUserParkingPlaces = async (userId:string)=>{

    const places  = await prisma.parkingPlace.findMany({where:{ownerId:userId}})

    return places
}

const getParkingDetails = async (placeId:string)=>{
    const details = await prisma.parkingPlace.findUnique({where:{id:placeId}})

    return details


}

const getPendingParkingPlace = async ()=>{
    const pendingPlaces = await prisma.parkingPlace.findMany({where:{status:PlaceStatus.Pending}})

    return pendingPlaces
}

const resolveParkingPlaceRequest = async (placeId:string, status:PlaceStatus)=>{

    let place = await prisma.parkingPlace.findUnique({where:{id:placeId, status:PlaceStatus.Pending}})
    if (!place){
        throw new ApiError(httpStatus.NOT_FOUND, "Place not found")
    }

    let updatedPlace = await prisma.parkingPlace.update({where:{id:place.id}, data:{status}})

    return updatedPlace
}

const getParkingSpots = async (placeId:string)=>{

    const spots = await prisma.parkingSpot.findMany({where:{parking_place_id:placeId}})

    return spots
}

const updateParkingDetails = async (placeId:string, data:IParkingUpdate)=>{

    const updatedPlace = await prisma.parkingPlace.update({where:{id:placeId}, data:{...data}})

    return updatedPlace

}


const addToFavourite = async (userId:string, placeId:string)=>{

    const favourite = await prisma.favourite.create({data:{user_id:userId, parking_place_id:placeId}})

    return favourite
}

export const parkingPlaceService = {
    createParkingPlace,
    getParkingPlaces,
    getUserParkingPlaces,
    getParkingDetails,
    getParkingSpots,
    updateParkingDetails,
    addToFavourite
}