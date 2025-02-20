import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {uploadCloudinaary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';




const generateAccessTokenAndRefreshToken = async (user) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}); // so that other entities such as password are not checked again
        return {accessToken, refreshToken};
    }
    catch(err){
        throw new ApiError(500, "Error while generating tokens");
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

    const {email, userName, password} = req.body;

    if(!(email || userName)){
        throw new ApiError(400, "Email or Username required");
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    });

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Incorrect Password");
    }

    const {accessToken, refreshToken} = generateAccessTokenAndRefreshToken(user._id);

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

    const option = {
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


export {
    registerUser,
    loginUser,
    logoutUser
};