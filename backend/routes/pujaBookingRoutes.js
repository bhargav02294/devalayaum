// E:\devalayaum\backend\routes\pujaBookingRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import Puja from "../models/Puja.js";
import PujaBooking from "../models/PujaBooking.js";
import User from "../models/User.js";

const router = express.Router();

// helper: authenticate user token from Authorization header
const userAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ message: "No token provided" });
  }
  const parts = authHeader.split(" ");
  const token = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : authHeader;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ➕ Create booking (user must be logged in)
router.post("/", userAuth, async (req, res) => {
  try {
    const { pujaId, packageKey, userContact = {}, members = [], notes = "" } = req.body;
    if (!pujaId || !packageKey) return res.status(400).json({ message: "pujaId and packageKey required" });
    if (!Array.isArray(members) || members.length === 0)
      return res.status(400).json({ message: "At least one member is required" });

    const puja = await Puja.findById(pujaId);
    if (!puja) return res.status(404).json({ message: "Puja not found" });

    // find the package inside puja
    const pkg = (puja.packages || []).find((p) => p.key === packageKey);
    if (!pkg) return res.status(400).json({ message: "Package not found for this puja" });

    // user exists?
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const booking = new PujaBooking({
      puja: puja._id,
      pujaSnapshot: {
        name: puja.name,
        category: puja.category,
        packageKey,
        packageTitle: pkg.title,
        packagePrice: pkg.price,
        packageDiscountPrice: pkg.discountPrice,
      },
      user: user._id,
      userContact: {
        fullName: user.fullName || user.email,
        phone: user.phone || user.phone || "",
        email: user.email,
        ...userContact,
      },
      members,
      seats: members.length,
      notes,
      status: "pending",
    });

    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// GET all bookings for current user
router.get("/", userAuth, async (req, res) => {
  try {
    const bookings = await PujaBooking.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single booking (owner only)
router.get("/:id", userAuth, async (req, res) => {
  try {
    const booking = await PujaBooking.findById(req.params.id).populate("puja", "name");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.userId) return res.status(403).json({ message: "Forbidden" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
