import express from 'express';
import { getNotifications, createNotification, updateNotification, deleteNotification } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/:id', updateNotification);
router.delete('/:id', deleteNotification);

export default router;
