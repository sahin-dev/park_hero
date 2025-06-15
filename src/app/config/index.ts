import { Secret } from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export default {
    jwt:{
        secret:process.env.JWT_SECRET as Secret,
        expiresIn:process.env.JWT_EXPIRES_IN
    },
    bcrypt:{
        salt:  parseInt(process.env.BCRYPT_SALT!) 
    },
    emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
    port:process.env.PORT
}