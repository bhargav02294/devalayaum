// E:\devalayaum\backend\models\User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },

    // OTP fields
    otp: { type: String },
    otpExpiry: { type: Date },

    // verification flag
    verified: { type: Boolean, default: false },

    // profile fields
    fullName: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "" },
    dateOfBirth: { type: String },
    address: { type: String },
    pincode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
