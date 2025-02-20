import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import { response } from "express";
import fs from "fs";

const uploadCloudinaary = async (file) => {
    try{
        if(!file){
            return null;
        }
        const response = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        })
        // console.log("File uploaded successfully on cloudinary", response.url);
        fs.unlinkSync(file);
        return response;
    }
    catch(err){
        fs.unlinkSync(file);
        console.log("Error while uploading file on cloudinary", err);
    }
}

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

export {uploadCloudinaary};