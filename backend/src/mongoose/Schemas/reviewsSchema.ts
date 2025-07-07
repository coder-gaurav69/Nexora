import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    productReviewImages: [
      {
        type: String,
        required: true,
      },
    ],
    rating: {
      type: Number,
      required: true,
    },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Ensure user can review each product only once
reviewSchema.index({ customerId: 1, productId: 1 }, { unique: true });

const reviewModel = mongoose.model("Reviews", reviewSchema);
export default reviewModel;
