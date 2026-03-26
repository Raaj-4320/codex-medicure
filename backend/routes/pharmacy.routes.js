import express from 'express';
import { getPharmacies, updatePharmacy } from '../controllers/pharmacy.controller.js';

const router = express.Router();

router.get('/', getPharmacies);
router.patch('/:id', updatePharmacy);
router.put('/:id', updatePharmacy);

export default router;
