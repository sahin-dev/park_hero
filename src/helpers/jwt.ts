import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import config from '../app/config'

export const generateToken  = (payload:any)=>{
    
    const token = jwt.sign(
        payload,config.jwt.secret, {algorithm:'HS256',expiresIn:config.jwt.expiresIn} as SignOptions)
        
    return token
}

