import { generateToken } from "../../../helpers/jwt";
import config  from "../../config";
import prisma from "../../db/client";
import ApiError from "../../errorr/ApiError";
import { IUserCreate, IUserInformation, IUserUpdate, IVehicleCreate } from "./user.interfaces";
import bcrypt from 'bcrypt'


const registerUser = async (createUserData: IUserCreate) => {
    const user = await prisma.user.findUnique({
        where: { email: createUserData.email }    
    });

    if (user){
        throw new ApiError(httpStatus.CONFLICT, "User already exists with this email");
    }
    if (createUserData.password !== createUserData.confirmPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
    }
    const hashedPassword = await bcrypt.hash(createUserData.password, config.bcrypt.salt);

    const token = generateToken({
        email: createUserData.email,
        role: createUserData.role
    });    


    const userData = await prisma.user.create({
        data: {
            email: createUserData.email,
            password: hashedPassword,
            role: createUserData.role,
            accessToken: token,
        },
    });

    return  userData ;
}

const addInformation = async (userId: string, userInfo: IUserInformation) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            fullName: userInfo.fullName,
            phone: userInfo.phoneNumber
        },
    });

    return updatedUser;
}


const updateUser = async (userId: string, updateData: IUserUpdate) => {
    const user = await prisma.user.findUnique({
        where: { id:userId }
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const sanitizedData = {
        fullName: updateData.fullName || user.fullName, // Use existing value if not provided
        phone: updateData.phoneNumber || user.phone, // Use existing value if not provided
        email: updateData.email || user.email, // Use existing value if not provided
    }

    // if (updateData.password && updateData.password !== updateData.confirmPassword) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
    // }

    // if (updateData.password) {
    //     updateData.password = await bcrypt.hash(updateData.password, config.bcrypt.salt);
    // }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: sanitizedData,
    });

    return updatedUser;
}

const addVehicle = async (userId: string, vehicleData: IVehicleCreate) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const vehicle = await prisma.vehicle.create({
        data: {
            company: vehicleData.make,
            model: vehicleData.model,
            reg_number: vehicleData.reg_number,
            color: vehicleData.color,
            ownerId:userId
           
        }
    });

    return vehicle;
}