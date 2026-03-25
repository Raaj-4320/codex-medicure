import express from 'express';
import { getPharmacies, getMedicines } from '../controllers/pharmacy.controller.js';

const router = express.Router();

router.get('/', getPharmacies);
router.get('/medicines', getMedicines);

export default router;
