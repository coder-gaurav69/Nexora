import mongoose from "mongoose";

// Sub-schema for color and associated images
const ColorImageSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    imageList: { type: [String], required: true }, // Ensure imageList is required
  },
  { _id: false } // prevent automatic _id generation for sub-documents
);

// Main product schema
const ProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    ratings: { type: Number, default: 0 },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brandType: { type: String, required: true },
    features: { type: [String], default: [] },
    productDetails: { type: String },
    boxContents: { type: [String], default: [] },
    colorsAvailable: { type: [ColorImageSchema], default: [] },
    materialMadeUp: { type: String },
    sizesAvailable: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

// Create and export model
const productModel = mongoose.model("Product", ProductSchema);
export default productModel;
