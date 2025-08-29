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
import adminModel from "../mongoose/Schemas/adminSchema.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { MODE } from "../config.js";
const adminSignInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [accessToken, refreshToken] = tokenGenerator(req.user);
        const adminId = new ObjectId(req.user.adminId);
        const updatedAdmin = yield adminModel.findByIdAndUpdate(adminId, { $set: { refreshToken } }, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false,
            });
        }
        const options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: MODE === "development" ? "strict" : "none",
            secure: true,
        };
        const adminIdStr = req.user.adminId;
        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .cookie("adminId", adminIdStr, options);
        return res.status(200).json({
            adminId: adminIdStr,
            message: "Successfully Logged In",
            success: true,
        });
    }
    catch (error) {
        console.error("Admin SignIn Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const adminSignUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingAdmin = yield adminModel.find({ email });
        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin already exists with this email",
                success: false,
            });
        }
        const salt = 10;
        const hashedPassword = yield bcrypt.hash(password, salt);
        const newAdmin = yield adminModel.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });
        return res.status(200).json({
            message: "Admin Account Created Successfully",
            success: true,
        });
    }
    catch (err) {
        console.error("Admin Signup error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const adminLogOutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: MODE === "development" ? "strict" : "none",
        secure: true,
    };
    res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .clearCookie("adminId", options);
    return res.status(200).json({
        message: "Admin Logout Successfully",
        success: true,
    });
});
const validateAdminAuthController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, adminId, role } = req.user;
    res.status(200).json({
        message: "Authorized Admin",
        success: true,
        adminId: adminId,
        role: role,
    });
});
export { adminSignInController, adminSignUpController, adminLogOutController, validateAdminAuthController, };
