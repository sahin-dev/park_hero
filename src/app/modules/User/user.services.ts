import emailSender from "../../../helpers/nodemailer";
import { generateToken } from "../../../helpers/jwt";
import config  from "../../config";
import prisma from "../../db/client";
import ApiError from "../../errorr/ApiError";
import httpStatus from "http-status";

import { IUserCreate, IUserInformation, IUserUpdate, IVehicleCreate } from "./user.interfaces";
import bcrypt from 'bcrypt'
import { uploadToDigitalOcean } from "../../../helpers/digitalOcean";


//register user

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
    
    const userData = await prisma.user.create({
        data: {
            email: createUserData.email,
            password: hashedPassword,
            role: createUserData.role,
            fcmToken:createUserData.fcmToken,
        },
    });

    const token = generateToken({
        id:userData.id,
        email: createUserData.email,
        role: createUserData.role
    });    

    const updatedUser = await prisma.user.update({where:{id:userData.id}, data:{accessToken:token}})



    return  updatedUser ;
}

const addInformation = async (userId: string, userInfo: IUserInformation, file:Express.Multer.File) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    let avatarUrl = null;

    if (file){
         const uploadedFile = await uploadToDigitalOcean(file)
         avatarUrl = uploadedFile.Location

    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            fullName: userInfo.fullName,
            phone: userInfo.phone,
            avatarUrl
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


    if (updateData.password && updateData.password !== updateData.confirmPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
    }

    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, config.bcrypt.salt);
    }
        const sanitizedData = {
        fullName: updateData.fullName || user.fullName, // Use existing value if not provided
        phone: updateData.phoneNumber || user.phone, // Use existing value if not provided
        email: updateData.email || user.email, // Use existing value if not provided
        password: updateData.password || user.password
    }


    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: sanitizedData,
    });

    return updatedUser;
}


const addVehicle = async (userId: string, vehicleData: IVehicleCreate) => {
    console.log(userId)
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
            ownerId:user.id
           
        }
    });

    return vehicle;
}


const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // const client = new Twilio(config.twilio.accountSid, config.twilio.authToken);
  const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
  // const { phone } = payload;

  // Validate phone number
  // if (!phone || !phone.startsWith('+')) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'Phone number must be in E.164 format with country code.',
  //   );
  // }
  // Generate 6-digit OTP
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  const expiry = new Date(Date.now() + OTP_EXPIRY_TIME);

  const otp = await prisma.otp.findUnique({where:{userId:userData.id}})

  if (!otp){
    await prisma.otp.create({data:{code:code, expiry:expiry,userId:userData.id}})
  }else{
    await prisma.otp.update({where:{userId:userData.id}, data:{code:code,expiry:expiry}})
  }




  // // Check if phone number already exists in the OTP table
  // const existingOtp = await prisma.user.findUnique({
  //   where: { id: userData.id },
  // });
//   await prisma.user.update({where:{id:userData.id}, data:{otp,otpExpiry:expiry}})

  // if (existingOtp) {
  //   // Update OTP if phone number exists
  //   await prisma.user.update({
  //     where: { phone },
  //     data: {
  //       otp: Number(otp),
  //       otpExpiry: expiry,
  //     },
  //   });
  // }

  // Send OTP via Twilio SMS
  // const message = await client.messages.create({
  //   body: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
  //   from: config.twilio.twilioPhoneNumber,
  //   to: phone,
  // });
    try{
      await emailSender("Reset password verification",userData.email, `<p>Your OTP code is <strong>${code}</strong>. It will expire in 5 minutes.</p>`)
    }catch(err){
      console.log("Error sending email", err)
    }
    

    return {message:"Verification otp sent to your authorized email"}

  // Return formatted response
  // return {
  //   body: message.body,
  //   from: message.from,
  //   to: message.to,
  //   dateCreated: message.dateCreated,
  // };
};

const verifyOtpInDB = async (payload: { email: string; code: string }) => {

  const userData = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!userData) {
    throw new ApiError(httpStatus.CONFLICT, 'user not found!');
  }
  const currentTime = new Date(Date.now());

  const otp = await prisma.otp.findUnique({where:{userId:userData.id}});

  if (!otp || otp.code !== payload.code || !otp.expiry || otp.expiry <= currentTime){
    throw new ApiError(httpStatus.BAD_REQUEST, "Your Otp is invalid")
  }

//   if (userData?.otp !== payload.otp) {

//     throw new ApiError(httpStatus.BAD_REQUEST, 'Your OTP is incorrect!');

//   } else if (!userData.otpExpiry || userData.otpExpiry <= currentTime) {
//     throw new ApiError(
//       httpStatus.CONFLICT,
//       'Your OTP is expired',
//     );
//   }

await prisma.otp.update({where:{id:otp.id}, data:{code:null, expiry:null}})

//   const updateStatus = await prisma.user.update({
//     where: { id:userData.id },
//     data: {
//       otp: null,
//       otpExpiry: null,
//     },
//   });
//   if (!updateStatus) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'User not updated!');
//   }

  // const accessToken = await generateToken(
  //   {
  //     id: userData.id,
  //     email: userData.email,
  //     role: userData.role,
  //   },
  //   config.jwt.access_secret as Secret,
  //   config.jwt.access_expires_in as string,
  // );
  return {
    message: 'OTP verified successfully!',
  };
};


const toggoleFavourite = async (userId:string,placeId:string )=>{
    const user  = await prisma.user.findUnique({where:{id:userId}})
    if (!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    const place = await prisma.parkingPlace.findUnique({where:{id:placeId}})

    if (!place){
        throw new ApiError(httpStatus.NOT_FOUND, "place not found")
    }

    const favourite = await prisma.favourite.findUnique({where:{user_id_parking_place_id:{user_id:userId, parking_place_id:placeId}}})

    if (!favourite){
        await prisma.favourite.create({data:{user_id:userId, parking_place_id:placeId}})
        return "place added to your favourite"
    }
    await prisma.favourite.delete({where:{id:favourite.id}})

    return "place removed from your favourite list"
}





export const usreService = {
    registerUser,
    addInformation,
    updateUser,
    addVehicle,
    forgetPassword,
    verifyOtpInDB,
    toggoleFavourite
}