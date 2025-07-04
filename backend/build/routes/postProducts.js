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
import productModel from "../mongoose/Schemas/productsSchema.js";
import upload from "../Multer/multer.js";
import reviewModel from "../mongoose/Schemas/reviewsSchema.js";
import userModel from "../mongoose/Schemas/userSchema.js";
import userCartDataModel from "../mongoose/Schemas/userCartDataSchema.js";
import cloudinary from "../Cloudinary/cloudinary.js";
const postRoute = express.Router();
// route for posting user account detail
postRoute.post("/userDetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phoneNumber, address, secondNumber } = req.body;
        // 1. Validate required fields
        if (!name ||
            !email ||
            !password ||
            !phoneNumber ||
            !address ||
            !secondNumber) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false,
            });
        }
        // 2. Check if user already exists
        const existingUser = yield userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists!",
                success: false,
            });
        }
        // 3. Create new user
        const newUser = yield userModel.create({
            name,
            email,
            password,
            phoneNumber,
            address,
            secondNumber,
        });
        return res.status(201).json({
            message: "User created successfully",
            success: true,
            data: newUser,
        });
    }
    catch (error) {
        console.error("Error posting userDetail:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
// route for posting new products
postRoute.post("/add-product", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productData = req.body;
        const files = req.files;
        const productName = (_a = productData.productName) === null || _a === void 0 ? void 0 : _a.trim();
        // 1. Validate product name
        if (!productName) {
            return res.status(400).json({ message: "Product name is required", success: false });
        }
        // 2. Check if product already exists (avoid duplicates)
        const existingProduct = yield productModel.findOne({ productName });
        if (existingProduct) {
            return res.status(409).json({
                message: "Product with this name already exists",
                success: false,
            });
        }
        // 3. Validate at least one image uploaded
        if (!files || files.length === 0) {
            return res.status(400).json({
                message: "At least one image is required",
                success: false,
            });
        }
        const mapping = new Map();
        // 4. Upload files to Cloudinary & organize by color
        for (const file of files) {
            const color = file.fieldname.trim(); // e.g., "red"
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
            try {
                const uploadResult = yield cloudinary.uploader.upload(base64, {
                    folder: `E-Commerce/${productName}/${color}`,
                });
                if (!mapping.has(color)) {
                    mapping.set(color, []);
                }
                mapping.get(color).push(uploadResult.secure_url);
            }
            catch (cloudErr) {
                console.error(`Error uploading image for color ${color}:`, cloudErr);
                return res.status(500).json({
                    message: `Failed to upload image for color ${color}`,
                    success: false,
                });
            }
        }
        // 5. Create colorsAvailable array
        const colorsAvailable = [];
        mapping.forEach((imageList, color) => {
            colorsAvailable.push({ color, imageList });
        });
        // 6. Create product
        const newProduct = yield productModel.create(Object.assign(Object.assign({}, productData), { productName,
            colorsAvailable }));
        return res.status(201).json({
            message: "Product uploaded successfully",
            success: true,
            product: newProduct,
        });
    }
    catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : error,
        });
    }
}));
// route for adding products to carts
postRoute.post("/add-cart-product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId, productId, productName, quantity, price, imageLink, category } = req.body;
    // console.log(customerId, productId, productName, quantity, price, imageLink,category);
    //  1. Validate required fields
    if (!customerId ||
        !productId ||
        !productName ||
        !quantity ||
        !price ||
        !imageLink ||
        !category) {
        return res.status(400).json({
            message: "Missing required fields: customerId, productId, productName, quantity, price, imageLink",
            success: false,
        });
    }
    try {
        // 2. Check if this product is already in the customer's cart
        const existingProduct = yield userCartDataModel.findOne({
            customerId,
            productId,
        });
        if (existingProduct) {
            return res.status(409).json({
                message: "Product is already in the cart.",
                success: false,
            });
        }
        // 3. Create new cart entry
        const newCartItem = yield userCartDataModel.create({
            customerId,
            productId,
            productName,
            quantity,
            price,
            imageLink,
            category
        });
        return res.status(200).json({
            message: "Product added to cart successfully.",
            success: true,
            data: newCartItem,
        });
    }
    catch (error) {
        console.error("Error adding product to cart:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : error,
        });
    }
}));
// route for posting reviews
postRoute.post("/post-review", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId, productId, rating, name, title, review } = req.body;
    const files = req.files;
    // ✅ Validate required fields
    if (!customerId || !productId || !rating || !name || !title || !review) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        });
    }
    try {
        const productReviewImages = [];
        // ✅ Upload each file to Cloudinary
        for (const file of files) {
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
            const result = yield cloudinary.uploader.upload(base64, {
                folder: `E-Commerce/review/${name}:${customerId}`,
            });
            productReviewImages.push(result.secure_url);
        }
        // ✅ Create review entry
        const newReview = yield reviewModel.create({
            customerId,
            productId,
            rating,
            name,
            title,
            review,
            productReviewImages,
        });
        return res.status(200).json({
            message: "Review submitted successfully",
            success: true,
            data: newReview,
        });
    }
    catch (error) {
        console.error("Error submitting review:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
// route to delete a product
postRoute.delete("/deleteProduct", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    if (!productId) {
        return res.status(400).json({
            message: "productId is required!",
            success: false,
        });
    }
    try {
        const item = yield productModel.findOne({ _id: productId });
        if (!item) {
            return res.status(400).json({
                message: "No such item exist with this productId",
                success: false,
            });
        }
        yield productModel.deleteOne({ _id: productId });
        return res.status(200).json({
            message: "Delted Successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error deleting item", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
export default postRoute;
