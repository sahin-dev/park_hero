import prisma from "../../db/client"
import ApiError from "../../errorr/ApiError"
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { generateToken } from "../../../helpers/jwt"
import { UserRole } from "../../../generated/prisma"


const signin = async (email:string, password:string, role:UserRole) => {

    const user = await prisma.user.findFirst({where:{email,role}})

    if (!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    if (await bcrypt.compare(password, user.password)){
        const payload = {id:user.id, role:user.role}

        const accessToken = generateToken(payload)

       const updatedUser =  await prisma.user.update({where:{id:user.id}, data:{accessToken}})
        return updatedUser
    }else {
        throw new ApiError(httpStatus.BAD_REQUEST, "User creadentials are not matched")
    }
}


const signOut = async (userId:string) => {
    const user = await prisma.user.findUnique({where:{id:userId}})
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    await prisma.user.update({where:{id:userId}, data:{accessToken:null}})
    
    return {message: "User signed out successfully"}
}

export {
    signin,
    signOut

}