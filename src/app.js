import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})); // Cross-Origin Resource Sharing   

app.use(express.json({limit: "16kb"})); // Parse JSON bodies
app.use(express.urlencoded({extended: true, limit: "16kb"})); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files
app.use(cookieParser()); // Parse cookie headers



//Routes
import userRouter from "./routes/user.routes.js";
import healthCheckRouter from "./routes/healthCheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js"

//routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1", healthCheckRouter);
app.use("/api/v1/tweets", tweetRouter);


export {app};