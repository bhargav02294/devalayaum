// E:\devalayaum\backend\models\PujaBooking.js
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: String },
    city: { type: String },
    rashi: { type: String },
    gotra: { type: String },
    specificWish: { type: String },
  },
  { _id: false }
);

const pujaBookingSchema = new mongoose.Schema(
  {
    puja: { type: mongoose.Schema.Types.ObjectId, ref: "Puja", required: true },
    pujaSnapshot: {
      // store a small copy of puja fields for quick reference
      name: { type: Object },
      category: { type: String },
      packageKey: { type: String },
      packageTitle: { type: Object }, // multilingual title snapshot
      packagePrice: { type: Number },
      packageDiscountPrice: { type: Number },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userContact: {
      fullName: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    members: { type: [memberSchema], required: true }, // one or many
    seats: { type: Number, default: 1 },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    notes: { type: String },
    payment: {
      method: { type: String }, // optional: 'razorpay' etc.
      paid: { type: Boolean, default: false },
      txnId: { type: String },
      amountPaid: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model("PujaBooking", pujaBookingSchema);
