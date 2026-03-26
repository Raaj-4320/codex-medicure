import express from 'express';
import { getPayouts, createPayout, updatePayout } from '../controllers/payout.controller.js';

const router = express.Router();

router.get('/', getPayouts);
router.post('/', createPayout);
router.patch('/:id', updatePayout);

export default router;
