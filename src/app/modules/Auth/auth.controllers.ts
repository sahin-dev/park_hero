import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import {signin, signOut} from './auth.services'
import sendResponse from "../../../shared/sendResponse";
import httpStatus  from "http-status";

const handleSignin = catchAsync(async (req:Request, res:Response)=>{
    const {email, password}  = req.body
    const result = await  signin(email, password)


    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"User logged in successfully",
        data:result
    })
})

const handleSignout = catchAsync (async (req:any, res:Response)=>{
    const user = req.user

    const result = await signOut(user.id)

    sendResponse (res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"Sign out successfully",
    })
})

export const AuthController = {
    handleSignin,
    handleSignout
}