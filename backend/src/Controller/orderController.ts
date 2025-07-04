import { Request, Response } from "express";
import customerOrderSchema from "../mongoose/Schemas/userOrderSchema.js";
import userOrderSchema from "../mongoose/Schemas/userOrderSchema.js";
import userModel from "../mongoose/Schemas/userSchema.js";
import { ObjectId } from "mongodb";

// You can define a proper type for req.user if needed
const orderController = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = req.user;

    const orderId = (await customerOrderSchema.create(data))._id.toString();

    return res.status(200).json({
      message: "Order Created Successfully",
      success: true,
      orderId: orderId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const customerId = req.query.customerId as string | undefined;
  const orderId = req.query.orderId as string | undefined;

  try {
    // Validate user existence (only if customerId provided)
    if (customerId) {
      const user = await userModel.findById(customerId);
      if (!user) {
        return res.status(404).json({
          message: "User not found with this customerId",
          success: false,
        });
      }
    }

    // Build filter dynamically
    const filter: any = {};
    if (customerId) filter.customerId = new ObjectId(customerId);
    if (orderId) filter._id = new ObjectId(orderId);

    const orders = await userOrderSchema.find(filter);
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
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const updateOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const updatedOrder = await userOrderSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          recipientType,
          deliveryAddress,
          shippingInfo,
        },
      },
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export default updateOrderController;


export { getOrderController, orderController, updateOrderController };
