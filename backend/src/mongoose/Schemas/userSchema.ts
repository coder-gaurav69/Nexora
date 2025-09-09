import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePhoto: {
      type: String,
    },
    password: {
      type: String,
      //   required: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    
    shippingInfo: {
      firstName: { type: String },
      lastName: { type: String },
      phoneNumber: { type: String },
      email: { type: String },
    },

    deliveryAddress: {
      street: { type: String},
      optional: { type: String },
      city: { type: String},
      state: { type: String},
      zip: { type: String },
    },

    secondNumber: {
      type: Number,
    },
    refreshToken: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("Users", UserSchema);

export default userModel;
