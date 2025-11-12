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

// 🕉️ Donation Schema
const donationSchema = new mongoose.Schema(
  {
    // 🖼️ Media
    thumbnail: { type: String, required: true }, // Cloudinary image URL

    // 🛕 Temple Details
    templeName: multilingualField, // temple name (e.g., Kashi Vishwanath)
    address: multilingualField,
    templeDetails: multilingualField, // about temple
    shortDetails: multilingualField, // 2–3 line summary

    // 💰 Donation Info
    donationName: multilingualField,
    description: multilingualField,
    summary: multilingualField,
    benefits: multilingualField,

    // 🌐 Meta
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
