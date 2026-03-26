import express from 'express';
import { getPrescriptions, createPrescription, updatePrescription } from '../controllers/prescription.controller.js';

const router = express.Router();

router.get('/', getPrescriptions);
router.post('/', createPrescription);
router.patch('/:id', updatePrescription);

export default router;
