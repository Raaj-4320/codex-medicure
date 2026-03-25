import express from 'express';
import { health, getLocations } from '../controllers/misc.controller.js';

const router = express.Router();

router.get('/health', health);
router.get('/locations/master', getLocations);

export default router;
