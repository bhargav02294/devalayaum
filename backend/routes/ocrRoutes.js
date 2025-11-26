// E:\devalayaum\backend\routes\ocrRoutes.js
import express from "express";
import multer from "multer";
import { extractTempleData } from "../controllers/ocrController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/temple", upload.single("file"), extractTempleData);

export default router;
