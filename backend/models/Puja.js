import mongoose from "mongoose";

// 🌐 Multilingual field helper
const multilingualField = {
  en: { type: String },
  hi: { type: String },
  mr: { type: String },
  ta: { type: String },
  te: { type: String },
  bn: { type: String },
};

// 🧩 Package sub-schema
const packageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    title: multilingualField,
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    details: multilingualField,
    benefits: multilingualField,
    seatsIncluded: { type: Number, default: 1 },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

// 🧾 Booking form sub-schema
const bookingFormFieldSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    label: multilingualField,
    placeholder: multilingualField,
  },
  { _id: false }
);

const bookingFormSchema = new mongoose.Schema(
  {
    fullName: { type: bookingFormFieldSchema, default: () => ({ enabled: true, required: true }) },
    gotra: { type: bookingFormFieldSchema, default: () => ({ enabled: true }) },
    dateOfBirth: { type: bookingFormFieldSchema, default: () => ({ enabled: true }) },
    cityCountry: { type: bookingFormFieldSchema, default: () => ({ enabled: true }) },
    specificWish: { type: bookingFormFieldSchema, default: () => ({ enabled: true }) },
    rashi: { type: bookingFormFieldSchema, default: () => ({ enabled: true }) },
    extraFields: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

// 🕉️ Main Puja Schema
const pujaSchema = new mongoose.Schema(
  {
    // -------------------- Basic Info --------------------
    name: multilingualField,
    slug: { type: String, unique: true, sparse: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    deityAssociated: multilingualField,

    // -------------------- Media --------------------
    image: { type: String },
    images: [{ type: String }],
    videoUrl: { type: String },

    // ------------------ Spiritual Description ------------------
    description: multilingualField,
    whyPerform: multilingualField,
    benefits: multilingualField,
    procedure: multilingualField,
    mantra: multilingualField,
    duration: { type: String },
    materialsRequired: multilingualField,

    // ------------------ Temple / Location ------------------
    availableAt: [multilingualField], // ✅ Multilingual array of locations
    placesDescription: multilingualField,

    // ------------------ Packages ------------------
    packages: { type: [packageSchema], default: [] },

    // ------------------ Booking Form Config ------------------
    bookingForm: { type: bookingFormSchema, default: () => ({}) },

    // ------------------ Price & Availability ------------------
    price: { type: Number },
    discountPrice: { type: Number },
    pujaPackageType: { type: String },
    availability: { type: String },

    // ------------------ Meta ------------------
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ⚙️ Auto-generate slug
pujaSchema.pre("save", function (next) {
  if (!this.slug && this.name?.en) {
    this.slug = this.name.en
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export default mongoose.model("Puja", pujaSchema);
