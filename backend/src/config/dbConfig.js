import mongoose from "mongoose";
import { DB_URL } from "./variables.js";

export const connectDB = async () => {
    try{
        await mongoose.connect(DB_URL);
        console.log("Database connected successfully");
    }
    catch(err){
        console.log("Database connection failed");
        console.log(err);
    }
}