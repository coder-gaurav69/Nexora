var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import userModel from "../mongoose/Schemas/userSchema.js";
const userRoute = express.Router();
userRoute.patch("/user/updateProfile/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedUser = yield userModel.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found", success: false });
            return;
        }
        res.json({
            message: "User updated successfully",
            success: true,
            user: updatedUser,
        });
    }
    catch (error) {
        console.error(error.message || error);
        res.status(500).json({ message: "Error updating user", error: error.message || error });
    }
}));
export default userRoute;
