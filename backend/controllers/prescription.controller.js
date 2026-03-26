import { getDb } from '../db/index.js';
import crypto from 'crypto';
import { ACTIVE_PRESCRIPTION_STATUSES, ensureArray, findById, isValidEntity, pushNotificationIfMissing } from './controller.utils.js';

const allowedPrescriptionTransitions = {
  pending: ['approved', 'rejected'],
  approved: [],
  rejected: [],
};

const validatePrescriptionReferences = (db, payload) => {
  if (!payload.userId) return 'userId is required';
  if (!isValidEntity(db.data.users || [], payload.userId)) return `Invalid userId: ${payload.userId}`;

  if (!payload.pharmacyId) return 'pharmacyId is required';
  if (!isValidEntity(db.data.pharmacies || [], payload.pharmacyId)) return `Invalid pharmacyId: ${payload.pharmacyId}`;

  if (payload.orderId) {
    const order = findById(db.data.orders || [], payload.orderId);
    if (!order) return `Invalid orderId: ${payload.orderId}`;
    if (order.customerId !== payload.userId && order.userId !== payload.userId) return 'orderId does not belong to userId';
    if (order.pharmacyId !== payload.pharmacyId) return 'orderId does not belong to pharmacyId';
  }

  return null;
};

export const getPrescriptions = async (req, res) => {
  try {
    const { id, userId, pharmacyId, status } = req.query;
    const db = await getDb();
    let prescriptions = db.data.prescriptions || [];
    if (id) prescriptions = prescriptions.filter((p) => p.id === id);
    if (userId) prescriptions = prescriptions.filter((p) => p.userId === userId);
    if (pharmacyId) prescriptions = prescriptions.filter((p) => p.pharmacyId === pharmacyId);
    if (status) prescriptions = prescriptions.filter((p) => p.status === status);
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const db = await getDb();
    ensureArray(db, 'prescriptions');
    const data = {
      id: `RX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...req.body,
    };

    const refError = validatePrescriptionReferences(db, data);
    if (refError) return res.status(400).json({ error: refError });

    if (data.orderId) {
      const activeForOrder = db.data.prescriptions.some(
        (p) => p.orderId === data.orderId && ACTIVE_PRESCRIPTION_STATUSES.includes(p.status)
      );
      if (activeForOrder) {
        return res.status(400).json({ error: `Active prescription already exists for orderId: ${data.orderId}` });
      }
    }

    db.data.prescriptions.push(data);
    await db.write();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'prescriptions');
    const index = db.data.prescriptions.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Prescription not found' });

    const current = db.data.prescriptions[index];
    if (req.body.status && req.body.status !== current.status) {
      const allowed = allowedPrescriptionTransitions[current.status] || [];
      if (!allowed.includes(req.body.status)) {
        return res.status(400).json({ error: `Invalid prescription transition from ${current.status} to ${req.body.status}` });
      }
    }

    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    const refError = validatePrescriptionReferences(db, updated);
    if (refError) return res.status(400).json({ error: refError });

    if (updated.orderId) {
      const activeForOrder = db.data.prescriptions.some(
        (p) => p.id !== id && p.orderId === updated.orderId && ACTIVE_PRESCRIPTION_STATUSES.includes(p.status)
      );
      if (activeForOrder) {
        return res.status(400).json({ error: `Active prescription already exists for orderId: ${updated.orderId}` });
      }
    }

    db.data.prescriptions[index] = updated;

    if (updated.status && ['approved', 'rejected'].includes(updated.status)) {
      pushNotificationIfMissing({
        db,
        userId: updated.userId,
        title: `Prescription ${updated.status}`,
        message: `Prescription ${updated.id} has been ${updated.status}.`,
        type: 'prescription',
        referenceId: updated.id,
      });
    }

    await db.write();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prescription' });
  }
};
