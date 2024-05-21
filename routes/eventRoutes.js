import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../controllers/eventController.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.get("/events", getAllEvents);

router.post(
  "/create_event",
  isAuthenticated,
  authorizeAdmin,
  singleUpload,
  createEvent
);

router.put(
  "/update_event/:id",
  isAuthenticated,
  authorizeAdmin,
  singleUpload,
  updateEvent
);

router.delete(
  "/delete_event/:id",
  isAuthenticated,
  authorizeAdmin,
  deleteEvent
);
export default router;
