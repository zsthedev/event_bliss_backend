import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { chat } from "../controllers/otherController.js";

const router = express.Router();

router.get('/chat', isAuthenticated, chat)

export default router