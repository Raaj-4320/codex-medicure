import express from 'express';
import { getReturns, createReturn, updateReturn } from '../controllers/return.controller.js';

const router = express.Router();

router.get('/', getReturns);
router.post('/', createReturn);
router.patch('/:id', updateReturn);

export default router;
