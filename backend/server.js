// E:\devalayaum\backend\server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import templeRoutes from "./routes/templeRoutes.js";
import pujaRoutes from "./routes/pujaRoutes.js";
import aartiRoutes from "./routes/aartiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productPaymentRoutes from "./routes/productPaymentRoutes.js";
import pujaBookingRoutes from "./routes/pujaBookingRoutes.js";
import ocrRoutes from "./routes/ocrRoutes.js";
import llmRoutes from "./routes/llmRoutes.js";
import phonepeRoutes from "./routes/payments/phonepe.routes.js";

import donorsRoutes from "./routes/payments/donors.routes.js";


dotenv.config();

const app = express();
// ✅ FINAL CORS CONFIG
const allowedOrigins = [
  "https://devalayaum.in",
  "https://www.devalayaum.in",
  "https://devalayaum-1.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));

// health
app.get("/", (req, res) => res.send("Devalayaum backend running"));

// Register API routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/pujas", pujaRoutes);
app.use("/api/aartis", aartiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);   
app.use("/api/payments", paymentRoutes);
app.use("/api/product-payments", productPaymentRoutes);
app.use("/api/puja-bookings", pujaBookingRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/payments", phonepeRoutes);
app.use("/api/payments", donorsRoutes);



// connect mongodb
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";

  
// health check route
app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date() })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);