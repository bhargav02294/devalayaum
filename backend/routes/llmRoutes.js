import express from "express";
import { parseTempleLLM } from "../controllers/llmTempleParser.js";

const router = express.Router();

router.post("/parse-temple", parseTempleLLM);

export default router;
