import express from 'express';
import { getInventory, createInventory, updateInventory, deleteInventory } from '../controllers/inventory.controller.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/', createInventory);
router.patch('/:id', updateInventory);
router.put('/:id', updateInventory);
router.delete('/:id', deleteInventory);

export default router;
