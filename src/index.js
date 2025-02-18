// require("dotenv").config();

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path : './env'
});
connectDB().then(()=>{
    app.on("error", (error) => {
        console.log(`Error: ${error}`);
    });
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server running on port ${process.env.PORT}`);
    })
}).catch((error) => {
    console.log(`Error: ${error}`);
    process.exit(1);
})

















/*
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log(`Error: ${error}`);
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        }
    }
    catch (error) {
        console.error(error);
        throw new Error("Error al conectar a la base de datos");    
    }
})()

*/