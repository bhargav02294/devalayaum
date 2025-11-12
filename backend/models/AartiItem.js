// E:\devalayaum\backend\models\AartiItem.js
import mongoose from "mongoose";

// 🌐 Multilingual helper
const multilingualField = {
  en: { type: String },
  hi: { type: String },
  mr: { type: String },
  ta: { type: String },
  te: { type: String },
  bn: { type: String },
};

const aartiSchema = new mongoose.Schema(
  {
    // 🕉️ Basic Info
    title: multilingualField, // Aarti / Katha / Mantra title
    type: {
      type: String,
      enum: ["aarti", "katha", "mantra"],
      default: "aarti",
    },
    description: multilingualField, // Short summary
    content: multilingualField, // Full content
    meaning: multilingualField, // Only for mantra (optional)

    // 🌸 Media & Link
    image: { type: String }, // Thumbnail Cloudinary URL
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: false,
      default: null,
    },

    // 🌐 Meta
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("AartiItem", aartiSchema);
