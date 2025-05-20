import { Secret } from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export default {
    jwt:{
        secret:process.env.JWT_SECRET as Secret,
        expiresIn:process.env.JWT_EXPIRES_IN
    },
    port:process.env.PORT
}