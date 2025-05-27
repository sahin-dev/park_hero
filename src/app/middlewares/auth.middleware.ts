
import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import config from "../config"
import prisma from "../db/client";
import ApiError from "../errorr/ApiError";


const authMiddleware = (...roles:string[])=>{
    return async (req:any, res:Response, next:NextFunction) => {

    // Here you can implement your authentication logic
    // For example, checking if a token is present in the headers
    try{
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const requestedUser = await prisma.user.findUnique({
            where: { accessToken: token }
        });
        if (!requestedUser) {
            return res.status(401).json({ success: false, message: "Your session is expired. Kindly, login again" });
        }
        // You can also verify the token here, e.g., using a JWT library
        const decoded = jwt.verify(token, config.jwt.secret) as {id:string, role:string};
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        req.user = decoded

        // If you want to check for specific roles or permissions, you can do that here
        // For example, if you have a user object in the token, you can check its role
        // if (decoded.role !== 'admin') {  
        //     return res.status(403).json({ success: false, message: "Forbidden" });
        // }
        // If you want to attach user information to the request object, you can do that here
        // For example, if the token contains user information, you can decode it and attach it to the request
        // req.user = decoded; // Assuming the decoded token contains user information
        // Example: If the token is a JWT, you can decode it to get user information
        // const decodedToken = jwt.decode(token);
        // if (!decodedToken) {
        //     return res.status(401).json({ success: false, message: "Invalid token" });
        // }

        // If token is valid, proceed to the next middleware or route handler
        // You can also decode the token and attach user information to the request object
        // Example user data

        
        if (roles.length && !roles.includes(decoded.role)) {
            throw new ApiError(
            httpStatus.FORBIDDEN,
            "Forbidden! You are not authorized"
            );
        }

        next();
    }
        catch (error) {{
            next(error);
        }
}
    }
}

export default authMiddleware;