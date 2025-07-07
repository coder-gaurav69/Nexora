import express, { Response, Request } from "express";
import { tokenGenerator } from "./tokenGenerator.js";
import { CookieOptions } from "express";
import userModel from "../mongoose/Schemas/userSchema.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import { JWT_ACCESS_SECRET_KEY,JWT_REFRESH_SECRET_KEY } from "../config.js";

const signInController = async (req: Request, res: Response): Promise<any> => {
  try {
    const [accessToken, refreshToken] = tokenGenerator(req.user);
    const userId = new ObjectId((req.user as any).customerId);

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { refreshToken } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const options: CookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict",
      secure: true, // enable in production with HTTPS
    };

    const customerId = (req.user as any).customerId;
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .cookie("customerId", customerId, options);

    res.header({
      "x-access-token": accessToken,
      "x-refresh-token": refreshToken,
    });

    return res.status(200).json({
      customerId: customerId,
      message: "Successfully Logged In",
      success: true,
    });
  } catch (error) {
    console.error("SignIn Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const signUpController = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    // 2. Hash the password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Optionally generate tokens here (uncomment if needed)
    /*
    const payload = {
      name: newUser.name,
      email: newUser.email,
      id: newUser._id,
    };
    const { accessToken, refreshToken } = tokenGenerator(payload);

    const options: CookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    };

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);

    res.header({
      "x-access-token": accessToken,
      "x-refresh-token": refreshToken,
    });
    */

    // 5. Respond
    return res.status(200).json({
      message: "Account Successfully Created, Please Login Now",
      success: true,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const logOutController = async (req: Request, res: Response): Promise<any> => {
  const options: CookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "strict",
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
};


const validateUserAuthController = async (req:Request,res:Response):Promise<any>=>{
  const {name,email,customerId} = req.user as any;
  res.status(200).json({
    message:"Authorised User",
    success:true,
    customerId:customerId
  })
}

export { signInController, signUpController, logOutController ,validateUserAuthController};
