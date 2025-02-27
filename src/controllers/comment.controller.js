import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment} from "../models/comment.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(400, "Invalid video Id")
    }

    const comments = await Comment.find({
        video: videoId
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "Comments fetched successfully"
        )
    )
})



export {
    getVideoComment
}