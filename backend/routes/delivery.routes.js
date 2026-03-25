import express from 'express';
import { getAssignments, createAssignment, updateAssignment } from '../controllers/delivery.controller.js';

const router = express.Router();

router.get('/', getAssignments);
router.post('/', createAssignment);
router.patch('/:id', updateAssignment);

export default router;
