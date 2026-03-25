import { getDb } from '../db/index.js';

export const getInventory = async (req, res) => {
  try {
    const { pharmacyId } = req.query;
    const db = await getDb();
    let inventory = db.data.sellerMedicines || [];
    if (pharmacyId) {
      inventory = inventory.filter(i => i.pharmacyId === pharmacyId);
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const index = db.data.sellerMedicines.findIndex(i => i.id === id);
    if (index !== -1) {
      db.data.sellerMedicines[index] = { ...db.data.sellerMedicines[index], ...req.body };
      await db.write();
      res.json(db.data.sellerMedicines[index]);
    } else {
      res.status(404).json({ error: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
};
