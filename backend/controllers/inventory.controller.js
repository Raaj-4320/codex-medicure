import { getDb } from '../db/index.js';
import crypto from 'crypto';
import { ensureArray, isValidEntity } from './controller.utils.js';

export const getInventory = async (req, res) => {
  try {
    const { id, pharmacyId, isVisible, isFeatured } = req.query;
    const db = await getDb();
    let inventory = db.data.sellerMedicines || [];

    if (id) inventory = inventory.filter((i) => i.id === id);
    if (pharmacyId) inventory = inventory.filter((i) => i.pharmacyId === pharmacyId);
    if (isVisible !== undefined) inventory = inventory.filter((i) => String(i.isVisible) === String(isVisible));
    if (isFeatured !== undefined) inventory = inventory.filter((i) => String(i.isFeatured) === String(isFeatured));

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const createInventory = async (req, res) => {
  try {
    const db = await getDb();
    ensureArray(db, 'sellerMedicines');
    const {
      pharmacyId,
      name,
      stock,
      price,
      medicineMasterId,
      isVisible = true,
      isFeatured = false,
      discountPrice,
    } = req.body;

    if (!pharmacyId || !name || stock === undefined || price === undefined) {
      return res.status(400).json({ error: 'pharmacyId, name, stock and price are required' });
    }

    if (!isValidEntity(db.data.pharmacies || [], pharmacyId)) {
      return res.status(400).json({ error: `Invalid pharmacyId: ${pharmacyId}` });
    }

    const normalizedName = String(name).trim();
    if (!normalizedName) return res.status(400).json({ error: 'name is required' });

    const parsedStock = Number(stock);
    const parsedPrice = Number(price);
    if (Number.isNaN(parsedStock) || parsedStock < 0) return res.status(400).json({ error: 'stock must be a valid non-negative number' });
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) return res.status(400).json({ error: 'price must be a valid positive number' });

    const duplicateIndex = db.data.sellerMedicines.findIndex(
      (i) => i.pharmacyId === pharmacyId && String(i.name || '').trim().toLowerCase() === normalizedName.toLowerCase()
    );

    if (duplicateIndex !== -1) {
      const merged = {
        ...db.data.sellerMedicines[duplicateIndex],
        stock: Number(db.data.sellerMedicines[duplicateIndex].stock || 0) + parsedStock,
        price: parsedPrice,
        discountPrice: discountPrice !== undefined ? Number(discountPrice) : db.data.sellerMedicines[duplicateIndex].discountPrice,
        isVisible,
        isFeatured,
        medicineMasterId: medicineMasterId || db.data.sellerMedicines[duplicateIndex].medicineMasterId || null,
        updatedAt: new Date().toISOString(),
      };
      db.data.sellerMedicines[duplicateIndex] = merged;
      await db.write();
      return res.status(200).json(merged);
    }

    const item = {
      id: `INV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      pharmacyId,
      name: normalizedName,
      stock: parsedStock,
      price: parsedPrice,
      discountPrice: discountPrice !== undefined ? Number(discountPrice) : undefined,
      medicineMasterId: medicineMasterId || null,
      isVisible,
      isFeatured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.data.sellerMedicines.push(item);
    await db.write();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'sellerMedicines');
    const index = db.data.sellerMedicines.findIndex((i) => i.id === id);
    if (index === -1) return res.status(404).json({ error: 'Inventory item not found' });

    const next = {
      ...db.data.sellerMedicines[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    if (!next.pharmacyId || !isValidEntity(db.data.pharmacies || [], next.pharmacyId)) {
      return res.status(400).json({ error: `Invalid pharmacyId: ${next.pharmacyId}` });
    }

    db.data.sellerMedicines[index] = next;
    await db.write();
    res.json(next);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'sellerMedicines');
    const originalLength = db.data.sellerMedicines.length;
    db.data.sellerMedicines = db.data.sellerMedicines.filter((i) => i.id !== id);
    if (db.data.sellerMedicines.length === originalLength) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
};
