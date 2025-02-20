import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler( async (resizeBy, requestAnimationFrame, next) =>{
    try {
        const token = req.cookies?.accessToken 
        || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token){
            throw new ApiError(401, "Unauthorized Access");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select(" -password -refreshoken");
    
        if(!user){
            //frontend should redirect to login page
            throw new ApiError(401, "Invalid Acces Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "InvalidAccess");
        
    }
});