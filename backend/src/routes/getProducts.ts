import express, { Request, Response } from "express";
import reviewModel from "../mongoose/Schemas/reviewsSchema.js";
import productModel from "../mongoose/Schemas/productsSchema.js";
import userCartDataModel from "../mongoose/Schemas/userCartDataSchema.js";
import mongoose from "mongoose";
import userModel from "../mongoose/Schemas/userSchema.js";

const getRoute = express.Router();

// GET /api/products?category=Electronics
// GET /api/products?productId=685beb4ef2623483e5950caa
// GET /api/products                 → fetch all
getRoute.get("/products", async (req: Request, res: Response) => {
  const { category, productId } = req.query;

  try {
    let filter: any = {};

    if (productId) {
      filter._id = new mongoose.Types.ObjectId(productId as string);
    }

    let isAll = false;

    if (category) {
      const categoryArray = String(category)
        .split(',')
        .map(c => c.trim());

      isAll = categoryArray.includes("all");

      if (!isAll) {
        filter.category = { $in: categoryArray };
      }
    }

    const products = await productModel.find(isAll ? {} : filter);

    if (products.length > 0) {
      res.status(200).json({
        message: productId
          ? `Fetched product`
          : category
          ? `List of ${category} items`
          : `List of items`,
        success: true,
        data: products,
      });
    } else {
      res.status(404).json({
        message: "No items found",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error fetching product(s):", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});


// route for getting all reviews
// GET /api/reviews?customerId=123
// GET /api/reviews            → to get all reviews
getRoute.get("/reviews", async (req: Request, res: Response): Promise<any> => {
  const { customerId } = req.query;

  try {
    let filter: any = {};

    if (customerId) {
      filter.customerId = customerId;
    }

    const reviews = await reviewModel.find(filter);

    if (reviews.length > 0) {
      return res.status(200).json({
        message: customerId
          ? "Customer reviews fetched"
          : "All customer reviews",
        success: true,
        data: reviews,
      });
    } else {
      return res.status(404).json({
        message: "No reviews found",
        success: false,
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// GET /api/userDetails          ->fetch all users details
getRoute.get("/userDetails", async (req: Request, res: Response): Promise<any> => {
  try {
    const customerId = req.query.customerId as string | undefined;

    let users:string[];

    // If customerId is present
    if (customerId) {
      // Validate format
      if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          message: "Invalid customerId format",
          success: false,
        });
      }

      const user:string = await userModel.findById(customerId);
      if (!user) {
        return res.status(404).json({
          message: "Customer not found",
          success: false,
        });
      }

      users = [user]; // Return as array for consistent format
    } else {
      // No filter: return all users
      users = await userModel.find();
    }

    return res.status(200).json({
      message: customerId ? "User fetched successfully" : "All users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});


export default getRoute;
