import mongoose from "mongoose";

// Reusable multilingual schema
const multilingualField = {
  en: { type: String },
  hi: { type: String },
  mr: { type: String },
  ta: { type: String },
  te: { type: String },
  bn: { type: String },
};

const productSchema = new mongoose.Schema(
  {
    name: multilingualField,
    category: { type: String, required: true },
    subCategory: { type: String },
    description: multilingualField,
    material: { type: String },
    spiritualBenefit: multilingualField,
    usageInstruction: multilingualField,
    deityAssociated: multilingualField,
    mantra: multilingualField,
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, default: 0 },
    images: [{ type: String }], // multiple image URLs (Cloudinary)
    thumbnail: { type: String }, // main product image
    videoUrl: { type: String }, // optional
    dimensions: { type: String },
    size: { type: String },
    published: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
