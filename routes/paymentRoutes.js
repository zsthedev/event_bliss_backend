import express, { Router } from 'express';
import { createCheckOutSession } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middlewares/auth.js';
const router = express.Router();

router.post('/create_checkout/:id', isAuthenticated, createCheckOutSession)

router.post('/create_cart_checkout', isAuthenticated, createCheckOutSession)

export default router