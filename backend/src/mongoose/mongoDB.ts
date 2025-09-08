// MongoDB Connection

import mongoose from "mongoose";
import {MONGODB_URL} from '../config.js'

export const  connectMongoDB = async ()=>{
    try {
        const url = MONGODB_URL;
        await mongoose.connect(url);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.log('Failed to connect mongoDB');
    }
}
