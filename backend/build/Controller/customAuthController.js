var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tokenGenerator } from "./tokenGenerator.js";
import userModel from "../mongoose/Schemas/userSchema.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
const signInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [accessToken, refreshToken] = tokenGenerator(req.user);
        const userId = new ObjectId(req.user.customerId);
        const updatedUser = yield userModel.findByIdAndUpdate(userId, { $set: { refreshToken } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: "none",
            secure: true, // enable in production with HTTPS
        };
        const customerId = req.user.customerId;
        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .cookie("customerId", customerId, options);
        // res.header({
        //   "x-access-token": accessToken,
        //   "x-refresh-token": refreshToken,
        // });
        return res.status(200).json({
            customerId: customerId,
            message: "Successfully Logged In",
            success: true,
        });
    }
    catch (error) {
        console.error("SignIn Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        // 1. Check if user already exists
        const existingUser = yield userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false,
            });
        }
        // 2. Hash the password
        const salt = 10;
        const hashedPassword = yield bcrypt.hash(password, salt);
        // 3. Create new user
        const newUser = yield userModel.create({
            name,
            email,
            password: hashedPassword,
        });
        // 4. Respond
        return res.status(200).json({
            message: "Account Successfully Created, Please Login Now",
            success: true,
        });
    }
    catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const logOutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "none",
        secure: true, // enable in production with HTTPS
    };
    res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .clearCookie("customerId", options);
    return res.status(200).json({
        message: "Logout Successfully",
        success: true,
    });
});
const validateUserAuthController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, customerId } = req.user;
    res.status(200).json({
        message: "Authorised User",
        success: true,
        customerId: customerId
    });
});
export { signInController, signUpController, logOutController, validateUserAuthController };
