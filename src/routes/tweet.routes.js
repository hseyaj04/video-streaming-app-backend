import { Router } from "express";
import {
    createTweet,
    getAllTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet);
router.route("/get-all-tweets").get(verifyJWT, getAllTweets);



export default router