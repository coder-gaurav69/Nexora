var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from "mongodb";
import userModel from "../mongoose/Schemas/userSchema.js";
const orderMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId, recipientType, shippingInfo, deliveryAddress, items, paymentInfo, orderStatus, } = req.body;
    // Check if all required fields are present
    if (!customerId ||
        !recipientType ||
        !shippingInfo ||
        !deliveryAddress ||
        !items ||
        !paymentInfo ||
        !orderStatus) {
        res.status(400).json({
            message: "customerId, recipientType, shippingInfo, deliveryAddress, items, paymentInfo, and orderStatus are required",
        });
        return;
    }
    console.log("middleware chla");
    try {
        // Validate and check if user exists
        const _id = new ObjectId(customerId);
        const user = yield userModel.findById(_id);
        if (!user) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        // Attach valid data to req.user
        req.user = {
            customerId,
            recipientType,
            shippingInfo,
            deliveryAddress,
            items,
            paymentInfo,
            orderStatus,
        };
        next();
    }
    catch (error) {
        console.error("Order middleware error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
export { orderMiddleWare };
