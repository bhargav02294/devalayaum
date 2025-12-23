import mongoose from "mongoose";

const productPaymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
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

export default mongoose.model("ProductPayment", productPaymentSchema);
