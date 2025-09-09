import express, { Request, Response } from "express";
import userModel from "../mongoose/Schemas/userSchema.js";

const userRoute = express.Router();

userRoute.patch(
  "/user/updateProfile/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: "User not found", success: false });
        return;
      }

      res.json({
        message: "User updated successfully",
        success: true,
        user: updatedUser,
      });
    } catch (error: any) {
      console.error(error.message || error);
      res.status(500).json({ message: "Error updating user", error: error.message || error });
    }
  }
);

export default userRoute;
