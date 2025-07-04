var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { MONGODB_URL } from '../config.js';
export const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = MONGODB_URL;
        yield mongoose.connect(url);
        console.log('MongoDB Connected Successfully');
    }
    catch (error) {
        console.log('Failed to connect mongoD');
    }
});
