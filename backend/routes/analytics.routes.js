import express from 'express';
import { getSellerAnalytics } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/', getSellerAnalytics);

export default router;
