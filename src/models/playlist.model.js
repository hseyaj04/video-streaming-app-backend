import mongoose, {Schema} from "mongoose";


const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videos:[{
        type: Schema.Types.ObjectId,
        ref: "Video",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});


export const Playlist = new mongoose.model("Playlist", playlistSchema)