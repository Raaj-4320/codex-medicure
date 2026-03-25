import express from 'express';
import { getMedicines } from '../controllers/pharmacy.controller.js';

const router = express.Router();

router.get('/', getMedicines);

export default router;
