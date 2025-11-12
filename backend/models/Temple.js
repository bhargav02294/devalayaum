import mongoose from "mongoose";

// Helper schema for multilingual text
const multilingualField = {
  en: { type: String },
  hi: { type: String },
  mr: { type: String },
  ta: { type: String },
  te: { type: String },
  bn: { type: String },
};

const templeSchema = new mongoose.Schema(
  {
    // 🛕 Basic Info
    name: multilingualField, // temple name in multiple languages
    location: multilingualField, // textual address (e.g. “Ayodhya, Uttar Pradesh”)
    about: multilingualField, // about the temple (long text)
    images: [{ type: String }], // Cloudinary image URLs (selected from device)

    // 🙏 Religious & Historical Info
    mainDeity: multilingualField,
    deityDescription: multilingualField,
    significance: multilingualField,
    history: multilingualField,
    architecture: multilingualField,
    builderOrTrust: multilingualField,
    consecrationDate: { type: String },

    // 🕉️ Darshan & Aarti Info
    darshanTiming: multilingualField,
    aartiTimings: {
      morning: { type: String },
      shringar: { type: String },
      shayan: { type: String },
    },
    specialPoojaInfo: multilingualField,

    // 👕 Visitor Info
    dressCode: multilingualField,
    entryRules: multilingualField,
    prohibitedItems: [{ type: String }], // can stay as array (same for all languages)
    lockerFacility: { type: Boolean, default: false },

    // 🚗 Travel & Map
    howToReach: multilingualField,
    nearestAirport: multilingualField,
    nearestRailway: multilingualField,
    roadConnectivity: multilingualField,
    mapLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // 🏞️ Nearby Places
    nearbyPlaces: [
      {
        name: multilingualField,
        description: multilingualField,
      },
    ],

    // 🌐 Meta
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Temple", templeSchema);
