import { getDb } from '../db/index.js';
import crypto from 'crypto';
import { ACTIVE_RETURN_STATUSES, ensureArray, findById, pushNotificationIfMissing } from './controller.utils.js';

const allowedReturnTransitions = {
  pending: ['approved', 'rejected'],
  approved: ['refunded', 'replaced'],
  refunded: [],
  replaced: [],
  rejected: [],
};

const validateReturnOrder = (db, payload) => {
  if (!payload.orderId) return { error: 'orderId is required' };
  const order = findById(db.data.orders || [], payload.orderId);
  if (!order) return { error: `Invalid orderId: ${payload.orderId}` };
  return { order };
};

export const getReturns = async (req, res) => {
  try {
    const { id, customerId, pharmacyId, status } = req.query;
    const db = await getDb();
    let returns = db.data.returns || [];
    if (id) returns = returns.filter((r) => r.id === id);
    if (customerId) returns = returns.filter((r) => r.customerId === customerId);
    if (pharmacyId) returns = returns.filter((r) => r.pharmacyId === pharmacyId);
    if (status) returns = returns.filter((r) => r.status === status);
    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch returns' });
  }
};

export const createReturn = async (req, res) => {
  try {
    const db = await getDb();
    ensureArray(db, 'returns');
    const data = {
      id: `RET-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...req.body,
    };

    const { error, order } = validateReturnOrder(db, data);
    if (error) return res.status(400).json({ error });

    data.customerId ||= order.customerId || order.userId;
    data.pharmacyId ||= order.pharmacyId;

    const existingActive = db.data.returns.some(
      (r) => r.orderId === data.orderId && ACTIVE_RETURN_STATUSES.includes(r.status)
    );
    if (existingActive) {
      return res.status(400).json({ error: `Active return already exists for orderId: ${data.orderId}` });
    }

    db.data.returns.push(data);
    await db.write();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create return' });
  }
};

export const updateReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'returns');
    const index = db.data.returns.findIndex((r) => r.id === id);
    if (index === -1) return res.status(404).json({ error: 'Return not found' });

    const current = db.data.returns[index];
    const nextStatus = req.body.status;
    if (nextStatus && nextStatus !== current.status) {
      const allowed = allowedReturnTransitions[current.status] || [];
      if (!allowed.includes(nextStatus)) {
        return res.status(400).json({ error: `Invalid return transition from ${current.status} to ${nextStatus}` });
      }
    }

    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    const { error, order } = validateReturnOrder(db, updated);
    if (error) return res.status(400).json({ error });

    updated.customerId ||= order.customerId || order.userId;
    updated.pharmacyId ||= order.pharmacyId;

    if (updated.orderId) {
      const existingActive = db.data.returns.some(
        (r) => r.id !== id && r.orderId === updated.orderId && ACTIVE_RETURN_STATUSES.includes(r.status)
      );
      if (existingActive) {
        return res.status(400).json({ error: `Active return already exists for orderId: ${updated.orderId}` });
      }
    }

    db.data.returns[index] = updated;

    if (updated.customerId) {
      pushNotificationIfMissing({
        db,
        userId: updated.customerId,
        title: 'Return Request Updated',
        message: `Return ${updated.id} is now ${updated.status}.`,
        type: 'return',
        referenceId: updated.orderId,
      });
    }

    await db.write();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update return' });
  }
};
