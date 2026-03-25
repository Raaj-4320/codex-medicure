import { getDb } from '../db/index.js';

export const getPharmacies = async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.data.pharmacies || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pharmacies' });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.data.medicines || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
};
