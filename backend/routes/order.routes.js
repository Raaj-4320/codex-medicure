import express from 'express';
import { getOrders, createOrder, updateOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id', updateOrder);
router.put('/:id', updateOrder);

export default router;
