import { getDb } from '../db/index.js';
import crypto from 'crypto';
import { ensureArray, findById, isValidEntity } from './controller.utils.js';

export const getPayouts = async (req, res) => {
  try {
    const { sellerId, pharmacyId, status } = req.query;
    const db = await getDb();
    let payouts = db.data.payouts || [];

    if (sellerId) payouts = payouts.filter((p) => p.sellerId === sellerId);
    if (pharmacyId) payouts = payouts.filter((p) => p.pharmacyId === pharmacyId);
    if (status) payouts = payouts.filter((p) => p.status === status);

    res.json(payouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payouts' });
  }
};

const validatePayoutRefs = (db, payload) => {
  if (!payload.orderId) return 'orderId is required';
  const order = findById(db.data.orders || [], payload.orderId);
  if (!order) return `Invalid orderId: ${payload.orderId}`;

  if (!payload.sellerId) return 'sellerId is required';
  if (!isValidEntity(db.data.users || [], payload.sellerId)) return `Invalid sellerId: ${payload.sellerId}`;

  if (payload.pharmacyId && !isValidEntity(db.data.pharmacies || [], payload.pharmacyId)) {
    return `Invalid pharmacyId: ${payload.pharmacyId}`;
  }

  const pharmacyId = payload.pharmacyId || order.pharmacyId;
  const pharmacy = findById(db.data.pharmacies || [], pharmacyId);
  if (!pharmacy) return `Invalid pharmacyId: ${pharmacyId}`;
  if (pharmacy.sellerId !== payload.sellerId) return 'sellerId does not match pharmacy owner';

  return null;
};

export const createPayout = async (req, res) => {
  try {
    const db = await getDb();
    ensureArray(db, 'payouts');

    const payout = {
      id: `PYO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...req.body,
    };

    const refError = validatePayoutRefs(db, payout);
    if (refError) return res.status(400).json({ error: refError });

    const exists = db.data.payouts.some((p) => p.orderId === payout.orderId);
    if (exists) return res.status(400).json({ error: `Payout already exists for orderId: ${payout.orderId}` });

    db.data.payouts.push(payout);
    await db.write();
    res.status(201).json(payout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payout' });
  }
};

export const updatePayout = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'payouts');
    const index = db.data.payouts.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Payout not found' });

    const updated = {
      ...db.data.payouts[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    const refError = validatePayoutRefs(db, updated);
    if (refError) return res.status(400).json({ error: refError });

    const duplicate = db.data.payouts.some((p) => p.id !== id && p.orderId === updated.orderId);
    if (duplicate) return res.status(400).json({ error: `Payout already exists for orderId: ${updated.orderId}` });

    db.data.payouts[index] = updated;
    await db.write();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payout' });
  }
};
