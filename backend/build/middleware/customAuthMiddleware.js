var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userModel from "../mongoose/Schemas/userSchema.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { JWT_ACCESS_SECRET_KEY } from "../config.js";
import jwt from "jsonwebtoken";
import { tokenGenerator } from "../Controller/tokenGenerator.js";
// Sign In Middleware
const signInMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password is required!",
            success: false,
        });
    }
    try {
        const existingUser = yield userModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                message: "User doesn't exist with this email. Please sign up.",
                success: false,
            });
        }
        const isPasswordMatched = yield bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false,
            });
        }
        // Attach user info to request (optional)
        req.user = {
            customerId: String(existingUser._id),
            email: existingUser.email,
            name: existingUser.name,
        };
        next();
    }
    catch (error) {
        console.error("Error in signInMiddleware:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
// Sign Up Middleware
const signUpMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            message: "All fields are required!",
            success: false,
        });
    }
    try {
        const user = yield userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists. Please login instead.",
                success: false,
            });
        }
        req.user = req.body;
        next();
    }
    catch (error) {
        console.error("Error in signUpMiddleware:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const logOutMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.body;
    console.log(customerId);
    if (!customerId) {
        return res.status(400).json({
            message: "CustomerId is required!",
            success: false,
        });
    }
    try {
        if (!ObjectId.isValid(customerId)) {
            return res.status(400).json({
                message: "Invalid customerId format!",
                success: false,
            });
        }
        const objectId = new ObjectId(customerId);
        const existingUser = yield userModel.findById(objectId);
        if (!existingUser) {
            return res.status(404).json({
                message: "User doesn't exist with this customerId",
                success: false,
            });
        }
        next();
    }
    catch (error) {
        console.error("Error in Logout Middleware:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const validateUserAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, customerId, refreshToken } = req.cookies;
    // console.log( accessToken, customerId, refreshToken)
    if (!accessToken || !customerId || !refreshToken) {
        return res.status(400).json({
            message: "accessToken, customerId, and refreshToken are required",
            success: false,
        });
    }
    try {
        // 1. Check user exists
        const user = yield userModel.findById({ _id: customerId });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        // 2. Try verifying access token
        try {
            const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET_KEY);
            req.user = decoded;
            return next();
        }
        catch (err) {
            if (err.name !== "TokenExpiredError") {
                return res.status(401).json({
                    message: "Invalid access token",
                    success: false,
                });
            }
            // 3. If token is expired, verify refresh token
            try {
                if (user.refreshToken !== refreshToken) {
                    return res.status(403).json({
                        message: "Refresh token mismatch",
                        success: false,
                    });
                }
                // 4. Generate new access token
                const payload = {
                    email: user.email,
                    customerId: String(user._id),
                    name: user.name,
                };
                const [newAccessToken, newRefreshToken] = tokenGenerator(payload);
                yield userModel.findById({ _id: customerId }, {
                    $set: { refreshToken: newRefreshToken }
                });
                // 5. Set new access token in cookie
                const options = {
                    httpOnly: true,
                    sameSite: "strict",
                    // secure: true, // enable this in production with HTTPS
                };
                res.cookie("accessToken", newAccessToken, options).cookie("refreshToken", newRefreshToken, options).cookie("customerId", customerId, options);
                req.user = payload;
                return next();
            }
            catch (refreshErr) {
                return res.status(401).json({
                    message: "Session expired. Please log in again.",
                    success: false,
                });
            }
        }
    }
    catch (error) {
        console.error("validateUserAuth error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
export { signInMiddleware, signUpMiddleware, logOutMiddleWare, validateUserAuthMiddleware };
