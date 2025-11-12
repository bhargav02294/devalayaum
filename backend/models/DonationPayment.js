// E:\devalayaum\backend\models\DonationPayment.js
import mongoose from "mongoose";

const donationPaymentSchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  orderId: { type: String, required: true },
  paymentId: { type: String },
  signature: { type: String },
  status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DonationPayment", donationPaymentSchema);
