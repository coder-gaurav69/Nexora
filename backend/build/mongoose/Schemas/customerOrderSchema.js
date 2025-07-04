import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        ref: "Customer",
        required: true,
    },
    shippingInfo: {
        recipientType: {
            type: String,
            enum: ["Myself", "Gift"],
            required: true,
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true },
    },
    deliveryAddress: {
        street: { type: String, required: true },
        optional: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        instruction: { type: String },
    },
    items: [
        {
            productId: { type: String, ref: "Product", required: true },
            productName: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            imageLink: { type: String },
        },
    ],
    paymentInfo: {
        method: { type: String, enum: ["COD", "Online"], required: true },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            default: "Pending",
        },
        transactionId: { type: String },
    },
    orderStatus: {
        type: String,
        enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Placed",
    },
    deliveredAt: {
        type: Date,
    },
    orderedAt: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model("Order", OrderSchema);
