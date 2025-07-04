import express, { Response, Request, NextFunction } from "express";
import { ObjectId } from "mongodb";
import userModel from "../mongoose/Schemas/userSchema.js";

const orderMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    customerId,
    recipientType,
    shippingInfo,
    deliveryAddress,
    items,
    paymentInfo,
    orderStatus,
  } = req.body;

  // Check if all required fields are present
  if (
    !customerId ||
    !recipientType ||
    !shippingInfo ||
    !deliveryAddress ||
    !items ||
    !paymentInfo ||
    !orderStatus
  ) {
    res.status(400).json({
      message:
        "customerId, recipientType, shippingInfo, deliveryAddress, items, paymentInfo, and orderStatus are required",
    });
    return;
  }
  console.log("middleware chla")
  try {
    // Validate and check if user exists
    const _id = new ObjectId(customerId);
    const user = await userModel.findById(_id);

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
  } catch (error) {
    console.error("Order middleware error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export  {orderMiddleWare};
