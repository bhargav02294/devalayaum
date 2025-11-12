// E:\devalayaum\backend\models\DonationRecord.js
import mongoose from "mongoose";

const donationRecordSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String },
    amount: { type: Number, required: true },
    templeName: { type: String, required: true },
    donationName: { type: String },
    paymentId: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("DonationRecord", donationRecordSchema);
