import mongoose from "mongoose";

const pujaPaymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "PujaBooking", required: true },
    orderId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    phonepePaymentId: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    rawResponse: Object,
  },
  { timestamps: true }
);

export default mongoose.model("PujaPayment", pujaPaymentSchema);
