import express from 'express';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
import { assignToVendor, createRequest, getAllRequest, getMyEvents, getRequestDetails, updateRequestStatus } from '../controllers/requestController.js';

const router = express.Router();
router.post('/create_request', isAuthenticated, createRequest)
router.put('/assign/:reqId/:venId', isAuthenticated, assignToVendor)
router.get('/requests', isAuthenticated, authorizeAdmin, getAllRequest)
router.get('/my_requests', isAuthenticated, getMyEvents)
router.get('/request/:id', isAuthenticated, getRequestDetails)
router.put('/update_req_status/:id', isAuthenticated, updateRequestStatus)
export default router;