import mongoose from "mongoose";

const userCartDataSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    imageLink: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category:{
      type:String,
      require:true
    }
  },
  { timestamps: true }
);

// ✅ Ensure each user can add each product only once
userCartDataSchema.index({ customerId: 1, productId: 1 }, { unique: true });

const userCartDataModel = mongoose.model("UsersData", userCartDataSchema);
export default userCartDataModel;
