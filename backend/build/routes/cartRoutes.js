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
import userCartDataModel from "../mongoose/Schemas/userCartDataSchema.js";
const cartRoutes = express.Router();
// routes to update the quantity of any products based on productId and customerId
cartRoutes.patch("/userCartData/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity, productId, customerId } = req.body;
    // 1. Basic field check
    if (quantity === undefined || // quantity can be 0
        !productId ||
        !customerId) {
        return res.status(400).json({
            message: "quantity, productId and customerId are required",
            success: false,
        });
    }
    // 2. Validate types
    if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({
            message: "Quantity must be a non-negative number",
            success: false,
        });
    }
    if (typeof productId !== "string" || typeof customerId !== "string") {
        return res.status(400).json({
            message: "productId and customerId must be strings",
            success: false,
        });
    }
    // 3. Catch silly logic issues
    if (productId === customerId) {
        return res.status(400).json({
            message: "customerId and productId should not be same",
            success: false,
        });
    }
    try {
        // 4. Check if this cart item exists
        const exists = yield userCartDataModel.exists({ productId, customerId });
        if (!exists) {
            return res.status(404).json({
                message: "Cart item not found for given productId and customerId",
                success: false,
            });
        }
        // 5. If quantity is 0, delete it
        if (quantity === 0) {
            yield userCartDataModel.deleteOne({ productId, customerId });
            return res.status(200).json({
                message: "Item removed from cart because quantity was 0",
                success: true,
            });
        }
        // 6. Otherwise, update the quantity
        const result = yield userCartDataModel.updateOne({ productId, customerId }, { $set: { quantity } });
        return res.status(200).json({
            message: "Quantity updated successfully",
            success: true
        });
    }
    catch (error) {
        console.error("Error updating userCartData:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
// route to delte the item based on productId and customerId
cartRoutes.delete("/userCartData/deleteItem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, customerId } = req.body; // or use req.query if sending as query params
    // 1. Validate input
    if (!productId || !customerId) {
        return res.status(400).json({
            message: "productId and customerId are required",
            success: false,
        });
    }
    if (productId === customerId) {
        return res.status(400).json({
            message: "productId and customerId should not be the same",
            success: false,
        });
    }
    try {
        // 2. Check if item exists
        const exists = yield userCartDataModel.exists({ productId, customerId });
        if (!exists) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false,
            });
        }
        // 3. Delete it
        const result = yield userCartDataModel.deleteOne({ productId, customerId });
        if (result.deletedCount === 0) {
            return res.status(400).json({
                message: "Failed to delete item",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Item deleted from cart successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error deleting cart item:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
// GET /api/userData            → fetch all usersData
// GET /api/userData?customerId=123 → fetch single userData
cartRoutes.get("/userCartData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.query;
    try {
        if (customerId) {
            const data = yield userCartDataModel.find({ customerId });
            if (data) {
                return res.status(200).json({
                    message: "User fetched successfully",
                    success: true,
                    data,
                });
            }
            else {
                return res.status(404).json({
                    message: "No user found with this customerId",
                    success: false,
                });
            }
        }
        // Fetch all users if no customerId is passed
        const allUsers = yield userCartDataModel.find();
        return res.status(200).json({
            message: "All users fetched successfully",
            success: true,
            data: allUsers,
        });
    }
    catch (error) {
        console.error("Error fetching userData:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
export default cartRoutes;
