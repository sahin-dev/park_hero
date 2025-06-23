import { cords, UserRole } from "../../../generated/prisma"

export interface IUserCreate {

    email: string,
    password: string,
    confirmPassword: string,
    role: UserRole,
    fcmToken:string
}

export interface IUserInformation {
    fullName: string,
    phone: string
}

export interface IUserUpdate {
    fullName?: string,
    location?:cords,
    phoneNumber?: string,
    email?: string,
    password?:string,
    confirmPassword?:string
}

export interface IUser {
    id: string,
    email: string,
    password: string,
    role: string,
    fullName: string,
    phoneNumber: string,
    createdAt: Date,
    updatedAt: Date
}

export interface IVehicleCreate {
    make: string,
    model: string,
    color: string[],
    reg_number: string,
    userId: string
}