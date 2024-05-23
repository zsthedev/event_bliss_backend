import express from "express";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { createPackage, deleteDeal, getAllPackages, getDeal, updatePackage } from "../controllers/packagesController.js";

const router = express.Router();

router.post('/create_package', isAuthenticated, authorizeAdmin, createPackage)
router.put('/update_package/:id', isAuthenticated, authorizeAdmin, updatePackage)
router.delete('/delete_package/:id', isAuthenticated, authorizeAdmin, deleteDeal)
router.get('/packages',  getAllPackages)
router.get('/package/:id', isAuthenticated, authorizeAdmin, getDeal)

export default router;
