import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {uploadCloudinaary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import jwt from 'jsonwebtoken';
import { response } from 'express';
import mongoose from 'mongoose';



const generateAccessTokenAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}); // so that other entities such as password are not checked again
        return {accessToken, refreshToken};
    }
    catch(err){
        throw new ApiError(500, err.message);
    }
}


const registerUser = asyncHandler(async (req, res) => { //async used due to cloudinary upload
    // Algorithm to register a user:
    // get user details from frontend X
    // validation - not empty X
    // check if user already exists: username, email X
    // check for images X
    // upload them to cloudinary, avatar X
    // remove password and refres h token field from response X
    // check for user creation X
    // return response X

    const {fullName, email, userName, password} = req.body 
    console.log("email: ", email);

    if (
        [fullName, email, userName, password].some(
            (field) => field?.trim === ""
        )
    ) {
        throw new ApiError(400, "All fields required");
    }

    const existingUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if(existingUser){
        throw new ApiError(409, "User already exists");
    }

    // console.log(req.files);
    

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath;
    if(req.files 
        && Array.isArray(req.files.coverImage) 
        && req.files.length > 0
    ){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image required");
    }

    const avatar = await uploadCloudinaary(avatarLocalPath);
    const coverImage = await uploadCloudinaary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500, "Error while uploading avatar image");   
    }



    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password
    });


    const createdUser = await User
    .findById(user._id)
    .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Error while creating user");
    }

    console.log(createdUser);
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!")
    )
})


const loginUser = asyncHandler(async (req, res) => {
    // algorithm
    // req body-> data .
    // email .
    // find the user . 
    // pass check .
    // access and refresh token .
    // send secure cookies
    // send reponse

    const {email, password} = await req.body;

    if(!email){
        throw new ApiError(400, "email is required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Incorrect Password");
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken)
    .cookie("responseToken", refreshToken)
    .json(
        new ApiResponse(200, 
            {
                user: loggedInUser, accessToken, refreshToken
            }, 
            "User Logged In Successfully"
        )
    );
});


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200, {}, "User Logged Out Successfully")
    )
});



const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh Token required");
        
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?.id);
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token expired or used");
        }
    
        const options={
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, 
                {accessToken, newRefreshToken}, 
                "Access Token Refreshed Successfully"
            )
        );
    } catch (error) {
        throw new ApiError(401, error?.message);
    }
    
})


const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Incorrect Password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        );
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "current user fetched successfully")
    );
})



const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body;

    if(!fullName || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: {
                fullName, //both ways are valid email one and fullName one
                email: email
            }
        }, 
        {new: true}
    ).select(" -password ");

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account details updated successfully")
    )
})


const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file missing")
    }

    const avatar = await uploadCloudinaary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: {
                avatar: avatar.url
            }
        }, 
        {new: true}
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, user, "Avatar updated successfully")
    )
})


const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover Image file missing")
    }

    const coverImage = await uploadCloudinaary(coverImageLocalPath);

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: {
                coverImage: coverImage.url
            }
        }, 
        {new: true}
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, user, "Cover Image updated successfully")
    )
})


const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {userName} = req.params;

    if(!userName?.trim()){
        throw new ApiError(400, "Username not found");
    }

    const channel = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName: 1,
                userName: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
        
        
    ])
    if(!channel?.length){
        throw new ApiError(404, "channel does not exist")
    }

    return res.status(200).json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )

})


const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await user.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from:"users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        userName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            user[0].watchHistory, 
            "Watch History fetched successfully"
        )
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};