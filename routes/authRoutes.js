import express from "express";
import {
  login,
  logout,
  getMyProfile,
  register,
  changePassword,
  updateProfile,
  updateProfilePicture,
  forgetPassword,
  resetPassword,
  getAllUsers,
  deleteUser,
  updateUserRole,
  addToCart,
  removeFromCart,
} from "../controllers/authController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getMyProfile);
router.put("/changepassword", isAuthenticated, changePassword);
router.put("/updateprofile", isAuthenticated, updateProfile);
router.put(
  "/updateprofilepicture",
  isAuthenticated,
  singleUpload,
  updateProfilePicture
);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:token", resetPassword);

router.put("/addtocart/:id", isAuthenticated, addToCart);
router.delete("/removefromcart/:id", isAuthenticated, removeFromCart);

// Admin Routes
router.get("/admin/users", isAuthenticated, authorizeAdmin, getAllUsers);
router.delete("/admin/user/:id", isAuthenticated, authorizeAdmin, deleteUser);
router.put("/admin/user/:id", isAuthenticated, authorizeAdmin, updateUserRole);

export default router;
