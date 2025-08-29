var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import customerOrderSchema from "../mongoose/Schemas/userOrderSchema.js";
import userOrderSchema from "../mongoose/Schemas/userOrderSchema.js";
import userModel from "../mongoose/Schemas/userSchema.js";
import { ObjectId } from "mongodb";
// You can define a proper type for req.user if needed
const orderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.user;
        const orderId = (yield customerOrderSchema.create(data))._id.toString();
        return res.status(200).json({
            message: "Order Created Successfully",
            success: true,
            orderId: orderId,
        });
    }
    catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const getOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.query.customerId;
    const orderId = req.query.orderId;
    try {
        // Validate user existence (only if customerId provided)
        if (customerId) {
            const user = yield userModel.findById(customerId);
            if (!user) {
                return res.status(404).json({
                    message: "User not found with this customerId",
                    success: false,
                });
            }
        }
        // Build filter dynamically
        const filter = {};
        if (customerId)
            filter.customerId = new ObjectId(customerId);
        if (orderId)
            filter._id = new ObjectId(orderId);
        const orders = yield userOrderSchema.find(filter);
        if (orders.length === 0) {
            return res.status(404).json({
                message: "No orders found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Successfully Fetched",
            success: true,
            data: orders,
        });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const updateOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { shippingInfo, deliveryAddress, recipientType } = req.body;
    if (!orderId || !shippingInfo || !deliveryAddress || !recipientType) {
        return res.status(400).json({
            message: "orderId, shippingInfo, deliveryAddress, recipientType are required",
            success: false,
        });
    }
    try {
        const id = new ObjectId(orderId);
        const updatedOrder = yield userOrderSchema.findByIdAndUpdate(id, {
            $set: {
                recipientType,
                deliveryAddress,
                shippingInfo,
            },
        }, { new: true, runValidators: true });
        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Order updated successfully",
            success: true,
            data: updatedOrder,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, status } = req.body;
    console.log(orderId, status);
    if (!orderId || !status) {
        return res.status(400).json({
            success: false,
            message: "orderId and status are required!",
        });
    }
    try {
        const id = new ObjectId(orderId);
        if (status === "Delivered") {
            const updatedOrder = yield userOrderSchema.findByIdAndUpdate(id, { $set: { orderStatus: status, "paymentInfo.status": "Completed" } }, { new: true });
        }
        const updatedOrder = yield userOrderSchema.findByIdAndUpdate(id, { $set: { orderStatus: status } }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found!",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully!",
            data: updatedOrder,
        });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating order status.",
        });
    }
});
export { getOrderController, orderController, updateOrderController, updateOrderStatus };
