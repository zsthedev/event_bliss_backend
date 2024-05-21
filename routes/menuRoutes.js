import express from "express";
import {
  createFood,
  deleteFood,
  getAllMenu,
  updateFood,
} from "../controllers/menuController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.get("/menu", getAllMenu);

router.post(
  "/create_food",
  isAuthenticated,
  authorizeAdmin,
  singleUpload,
  createFood
);

router.put(
  "/update_food/:id",
  isAuthenticated,
  authorizeAdmin,
  singleUpload,
  updateFood
);

router.delete(
  "/delete_food/:id",
  isAuthenticated,
  authorizeAdmin,
  deleteFood
);
export default router;
