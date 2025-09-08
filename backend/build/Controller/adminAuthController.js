// // adminAuthController.ts
// import express, { Response, Request } from "express";
// import { tokenGenerator } from "./tokenGenerator.js";
// import { CookieOptions } from "express";
// import adminModel from "../mongoose/Schemas/adminSchema.js";
// import { ObjectId } from "mongodb";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { MODE } from "../config.js";
// const adminSignInController = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const [accessToken, refreshToken] = tokenGenerator(req.user);
//     const adminId = new ObjectId((req.user as any).adminId);
//     const updatedAdmin = await adminModel.findByIdAndUpdate(
//       adminId,
//       { $set: { refreshToken } },
//       { new: true }
//     );
//     if (!updatedAdmin) {
//       return res.status(404).json({
//         message: "Admin not found",
//         success: false,
//       });
//     }
//     const options: CookieOptions = {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//       sameSite: MODE === "development" ? "strict" : "none",
//       secure: true,
//     };
//     const adminIdStr = (req.user as any).adminId;
//     res
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", refreshToken, options)
//       .cookie("adminId", adminIdStr, options);
//     return res.status(200).json({
//       adminId: adminIdStr,
//       message: "Successfully Logged In",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Admin SignIn Error:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };
// const adminSignUpController = async (req: Request, res: Response): Promise<any> => {
//   const { name, email, password } = req.body;
//   try {
//     const existingAdmin = await adminModel.find({email});
//     if (existingAdmin) {
//       return res.status(400).json({
//         message: "Admin already exists with this email",
//         success: false,
//       });
//     }
//     const salt = 10;
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newAdmin = await adminModel.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin",
//     });
//     return res.status(200).json({
//       message: "Admin Account Created Successfully",
//       success: true,
//     });
//   } catch (err) {
//     console.error("Admin Signup error:", err);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };
// const adminLogOutController = async (req: Request, res: Response): Promise<any> => {
//   const options: CookieOptions = {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000,
//     sameSite: MODE === "development" ? "strict" : "none",
//     secure: true,
//   };
//   res
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .clearCookie("adminId", options);
//   return res.status(200).json({
//     message: "Admin Logout Successfully",
//     success: true,
//   });
// };
// const validateAdminAuthController = async (req: Request, res: Response): Promise<any> => {
//   const { name, email, adminId, role } = req.user as any;
//   res.status(200).json({
//     message: "Authorized Admin",
//     success: true,
//     adminId: adminId,
//     role: role,
//   });
// };
// export {
//   adminSignInController,
//   adminSignUpController,
//   adminLogOutController,
//   validateAdminAuthController,
// };
