import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utild/ApiResponse.js"


const getAllVideos = asyncHandler(async(req, req) => {

})

const publishVideo = asyncHandler(async(req, res) => {
    const {title, description} = req.body;
    if(!title || !description){
        throw new ApiError(400, "All fields required")
    }
    const videoFileLocalPath = req.files?.video[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!videoFileLocalPath){
        throw new ApiError(400, "Video file required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail required")
    }

    const videoFile = await uploadCloudinary(videoFileLocalPath);
    const thumbnail = await uploadCloudinary(thumbnailLocalPath);

    if(!videoFile || !thumbnail){
        throw new ApiError(500, "error while uploading Video or Thumbnail")
    }

    if(!req.user?._id){
        throw new ApiError(400, "user not logged in");
    }

    const video = await Video.create({
        thumbnail: thumbnail?.url || "",
        title,
        description,
        videoFile: videoFile?.url || "",
        duration: videoFile.duration,
        owner: req.user._id
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "video published and uploaded successfully"
        )
    )

})

const getVideoById = asyncHandler(async(req, res) => {
    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(400, "couldn't fetched video")
    }

    const videoFile = Video.findById(videoId);
    if(!videoFile){
        throw new ApiError(400, "video not found")
    } 


    return res.status(200).json(
        new ApiResponse(
            200,
            videoFile,
            "video fetched successfully"
        )
    )

})


const updateVideo = asyncHandler(async(req, res) => {

    if(!req.user?._id){
        throw new ApiError(400, "user not logged In")
    }


    const {videoId} = req.params;
    const {title, description} = req.body;

    
    if(!videoId){
        throw new ApiError(400, "Couldn't fetch video")
    }

    

    if(!title || !description || !thumbnail){
        throw new ApiError(400, "Atleast one of thumbnail, description or title must be given")
    }
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    const videoFile = await Video.findById(videoId)


    if(videoFile.owner.toString() !== req.user._id){
        throw new ApiError(400, "unauthorised video update")
    }


    let newThumbnail;
    if (thumbnailLocalPath) {
      newThumbnail = await uploadCloudinary(thumbnailLocalPath);
      if (!newThumbnail) {
        throw new ApiError(500, "Thumbnail upload failed");
      }
    }
  

    if (title) videoFile.title = title;
    if (description) videoFile.description = description;
    if (newThumbnail) videoFile.thumbnail = newThumbnail;
    videoFile.save();

    

    return res.status(200).json(
        new ApiResponse(
            200,
            videoFile,
            "video file updated successfully"
        )
    )


    
})



const deleteVideo = asyncHandler(async(req, res) => {
    

    if(!req.user?._id){
        throw new ApiError(400, "User not logged In")
    }

    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(400, "video not fetched")
    }

    const videoFile = await Video.findById(videoId)

    if(videoFile.owner?.toString() !== req.user._id){
        throw new ApiError(400, "User not authorised to delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(
        new ApiResponse(
            200,
            videoFile,
            "Video deleted successfully"
        )
    )
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo
}