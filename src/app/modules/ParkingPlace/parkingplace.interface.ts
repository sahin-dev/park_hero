import { cords } from "../../../generated/prisma"


export interface IParkingCreate {
    title:string
    description:string,
    price:number,
    priceUnit:string,
    billingCycle:string,
    gallery:string[],
    amenities:string[]
    cords:cords
    availability:string | string[]
    totalSpots:number,
    location:cords,
    address:string,
    timing:{
        open:string,
        close:string
    },
}


export interface IParkingUpdate {
    title?:string
    description?:string,
    price?:number,
    priceUnit?:string,
    billingCycle?:string,
    gallery?:string[],
    amenities?:string[]
    availability?:string | string[]
    totalSpot?:number,
    location?:cords,
    address?:string,
    timing?:{
        open:string,
        close:string
    },
}