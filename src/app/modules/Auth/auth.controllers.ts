import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import {signin} from './auth.services'
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

export const AuthController = {
    handleSignin
}