import express from "express";

import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { createDecor, deleteDecor, getAllDecors, updateDecor } from "../controllers/decorController.js";
const router = express.Router();

router.get("/decors", getAllDecors);

router.post(
  "/create_decor",
  isAuthenticated,
  authorizeAdmin,
  singleUpload,
  createDecor
);

router.put(
  "/update_decor/:id",
  isAuthenticated,
  authorizeAdmin,
  singleUpload,
  updateDecor
);

router.delete(
  "/delete_decor/:id",
  isAuthenticated,
  authorizeAdmin,
  deleteDecor
);
export default router;
