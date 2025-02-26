import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import mongoose from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";


const createTweet = asyncHandler(async(req, res) => {

    const {content} = req.body;
    if(!content){
        throw new ApiError(400, "Content is Reuired")
    }

    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const tweet = await Tweet.create({
        content,
        owner: userId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, tweet, "tweet uploaded successfully"
        )
    )

})


const getAllTweets = asyncHandler(async(req, res) => {
    const owner = req.user?._id;
    if(!owner){
        throw new ApiError(400, "user not found")
    }
    console.log(owner)


    const tweetArr = await Tweet.find({
        owner: owner
    })
    console.log(tweetArr);
    
    return res.status(200).json(
        new ApiResponse(200, tweetArr, "all tweets fetched successfully")
    )
})


const updateTweet = asyncHandler(async(req, res) => {
    const {tweetId, newContent} = req.body;
    if(!newContent || !tweetId){
        throw new ApiError(400, "all fields required")
    }
    console.log(newContent);
    
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: newContent
            }
        },
        {new: true}
    )


    return res.status(200)
    .json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async(req, res) => {
    const {tweetId} = req.body;
    if(!tweetId){
        throw new ApiError(400, "Please enter tweet id")
    }

    try {
        await Tweet.findByIdAndDelete({
            _id: tweetId
        })
    } catch (error) {
        throw new ApiError(500, error);
    }


    return res.status(200)
    .json(
        new ApiResponse(
            200, {}, "tweet deleted successfully"
        )
    )
})



export {
    createTweet,
    getAllTweets,
    updateTweet,
    deleteTweet
}