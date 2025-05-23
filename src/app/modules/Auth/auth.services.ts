import prisma from "../../db/client"
import ApiError from "../../errorr/ApiError"
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { generateToken } from "../../../helpers/jwt"


const signin = async (email:string, password:string) => {

    const user = await prisma.user.findUnique({where:{email}})

    if (!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    if (await bcrypt.compare(user.password, password)){
        const payload = {id:user.id, role:user.role}

        const accessToken = generateToken(payload)

        await prisma.user.update({where:{id:user.id}, data:{accessToken:accessToken}})
        return user
    }else {
        throw new ApiError(httpStatus.BAD_REQUEST, "User creadentials are not matched")
    }
}

export {
    signin

}