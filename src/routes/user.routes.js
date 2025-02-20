import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        { 
            name: "avatar", //name should be same for frontend also
            maxCount: 1 
        },
        { 
            name: "coverImage", //name should be same for frontend also
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);


export default router;