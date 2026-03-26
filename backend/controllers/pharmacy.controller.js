import { getDb } from '../db/index.js';
import crypto from 'crypto';

export const getPharmacies = async (req, res) => {
  try {
    const { id, sellerId, verificationStatus, city } = req.query;
    const db = await getDb();
    let pharmacies = db.data.pharmacies || [];

    if (id) pharmacies = pharmacies.filter((p) => p.id === id);
    if (sellerId) pharmacies = pharmacies.filter((p) => p.sellerId === sellerId);
    if (verificationStatus) pharmacies = pharmacies.filter((p) => p.verificationStatus === verificationStatus);
    if (city) pharmacies = pharmacies.filter((p) => p.address?.city === city);

    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pharmacies' });
  }
};

export const updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const index = db.data.pharmacies.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Pharmacy not found' });

    db.data.pharmacies[index] = {
      ...db.data.pharmacies[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await db.write();
    res.json(db.data.pharmacies[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pharmacy' });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const { id, category, rxRequired, status, includeAll } = req.query;
    const db = await getDb();
    let medicines = db.data.medicines || [];

    if (id) medicines = medicines.filter((m) => m.id === id);
    if (category) medicines = medicines.filter((m) => m.category === category);
    if (rxRequired !== undefined) medicines = medicines.filter((m) => String(m.rxRequired) === String(rxRequired));
    if (status) {
      medicines = medicines.filter((m) => m.status === status);
    } else if (String(includeAll) !== 'true') {
      medicines = medicines.filter((m) => !m.status || m.status === 'approved');
    }

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
};

export const createMedicine = async (req, res) => {
  try {
    const db = await getDb();
    db.data.medicines ||= [];

    const { name, price, stock, description, pharmacyId, sellerId, status, genericName, category, dosageForm, strength, manufacturer, rxRequired } = req.body;
    if (!name || price === undefined || !pharmacyId) {
      return res.status(400).json({ error: 'name, price and pharmacyId are required' });
    }

    const pharmacy = (db.data.pharmacies || []).find((p) => p.id === pharmacyId);
    if (!pharmacy) return res.status(400).json({ error: `Invalid pharmacyId: ${pharmacyId}` });

    if (sellerId) {
      const seller = (db.data.users || []).find((u) => u.id === sellerId || u.uid === sellerId);
      if (!seller) return res.status(400).json({ error: `Invalid sellerId: ${sellerId}` });
      if (pharmacy.sellerId !== (seller.id || seller.uid)) {
        return res.status(400).json({ error: 'pharmacyId does not belong to sellerId' });
      }
    }

    const duplicate = db.data.medicines.find((m) => m.pharmacyId === pharmacyId && String(m.name || m.brandName || '').toLowerCase() === String(name).toLowerCase());
    if (duplicate) return res.status(400).json({ error: `Medicine ${name} already exists for this pharmacy` });

    const resolvedStatus = sellerId ? 'pending' : (status || 'approved');

    const medicine = {
      id: `MED-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name,
      brandName: name,
      genericName: genericName || name,
      category: category || 'General',
      dosageForm: dosageForm || 'Tablet',
      strength: strength || '',
      manufacturer: manufacturer || '',
      rxRequired: Boolean(rxRequired),
      description: description || '',
      price: Number(price),
      stock: Number(stock || 0),
      pharmacyId,
      sellerId: sellerId || pharmacy.sellerId,
      status: resolvedStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.data.medicines.push(medicine);
    await db.write();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create medicine' });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const index = db.data.medicines.findIndex((m) => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Medicine not found' });

    db.data.medicines[index] = {
      ...db.data.medicines[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await db.write();
    res.json(db.data.medicines[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update medicine' });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const original = db.data.medicines.length;
    db.data.medicines = db.data.medicines.filter((m) => m.id !== id);
    if (db.data.medicines.length === original) return res.status(404).json({ error: 'Medicine not found' });
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
};
