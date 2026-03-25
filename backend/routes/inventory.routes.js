import express from 'express';
import { getInventory, updateInventory } from '../controllers/inventory.controller.js';

const router = express.Router();

router.get('/', getInventory);
router.patch('/:id', updateInventory);
router.put('/:id', updateInventory);

export default router;
