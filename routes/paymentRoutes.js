import express, { Router } from 'express';
import { createCheckOutSession } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middlewares/auth.js';
const router = express.Router();

router.post('/create_checkout/:id', isAuthenticated, createCheckOutSession)

export default router