import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { usreService } from "./user.services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";



const register = catchAsync( async(req:Request,res:Response)=>{

    const userData = req.body

    const result = await usreService.registerUser(userData)

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.CREATED,
        message:"user registered successfully",
        data:result
    })

})



const addInformation = catchAsync(async (req:any, res:Response)=>{
    

    const information = req.body
    const user = req.user

   

    const result = await usreService.addInformation(user.id,information, req.file)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"informatoin added successfully",
        data:result
    })
})


const addVehicle = catchAsync (async (req:any, res:Response)=>{
    const data = req.body
    const user = req.user


    const result = await usreService.addVehicle(user.id,data)

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.CREATED,
         message:"vehicle added successfully",
         data:result
    })
})

const updateUser = catchAsync (async (req:any, res:Response)=>{
    const data = req.body
    const user = req.user

    const result = await usreService.updateUser(user.id,data)

    sendResponse (res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"user updated successfully",
        data:result
    })
})

const fogetpassword = catchAsync(async (req:any, res:Response)=>{

    const user =  req.user
    const body = req.body

    const result = await usreService.forgetPassword(body)

    sendResponse (res,
        {
            success:true,
            statusCode:httpStatus.OK,
            message:"otp sent to your authorised email",
            data:result
        }
    )
})

const verifyOtp = catchAsync(async (req:any, res:Response)=>{
    const user = req.user
    const body = req.body

    const result = await usreService.verifyOtpInDB(body)

    sendResponse (res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"Otp verified successfully",
        data:result
    })

})

const toggoleFavourite = catchAsync (async (req:any, res:Response)=>{
    const {placeId} = req.params
    const user = req.user
    console.log(req.params)

    

    const result = await usreService.toggoleFavourite(user.id, placeId)

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"favourit e toggoled successfully",
        data:result
    })
})

export const userController =  {
    register,
    addInformation,
    updateUser,
    fogetpassword,
    verifyOtp,
    addVehicle,
    toggoleFavourite
}