import express from 'express';
import { getCompliance, createCompliance, updateCompliance } from '../controllers/compliance.controller.js';

const router = express.Router();

router.get('/', getCompliance);
router.post('/', createCompliance);
router.patch('/:id', updateCompliance);

export default router;
