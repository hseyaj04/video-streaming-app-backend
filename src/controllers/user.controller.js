import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {uploadCloudinaary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';


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


export {registerUser};