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
    const {tId} = req.params;
    const {newContent} = req.body;

    if(!tId){
        throw new ApiError(400, "tweet not found");
    }
    if(!newContent){
        throw new ApiError(400, "new content is required not found");
    }

    const tweet = await Tweet.findById(tId);
    if(!tweet){
        throw new ApiError(400, "tweet not found");
    }


    if(tweet.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400, "user not authorized to update tweet");
    }
    tweet.content = newContent;
    await tweet.save();


    return res.status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "Tweet updated successfully"
        )
    )
})



const deleteTweet = asyncHandler(async(req, res) => {
    const {tweetId} = req.params;
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(400, "tweet not found");
    }

    if(tweet.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400, "user not authorized to delete tweet");
    }

    await Tweet.deleteOne({
        _id: tweetId,
        owner: req.user?._id
    });


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