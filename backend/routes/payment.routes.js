import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/orders', createOrder);
router.post('/verify', auth, verifyPayment);

export default router;
