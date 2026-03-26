import express from 'express';
import { getPayments, processPayment } from '../controllers/payment.controller.js';

const router = express.Router();

router.get('/', getPayments);
router.post('/', processPayment);

export default router;
