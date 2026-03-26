import { getDb } from '../db/index.js';
import crypto from 'crypto';
import { ensureArray, isValidEntity, pushNotificationIfMissing } from './controller.utils.js';

const allowedStatuses = ['pending', 'approved', 'rejected'];

export const getCompliance = async (req, res) => {
  try {
    const { sellerId, status } = req.query;
    const db = await getDb();
    let docs = db.data.complianceDocuments || [];
    if (sellerId) docs = docs.filter((d) => d.sellerId === sellerId);
    if (status) docs = docs.filter((d) => d.status === status);
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance documents' });
  }
};

export const createCompliance = async (req, res) => {
  try {
    const db = await getDb();
    ensureArray(db, 'complianceDocuments');

    const { sellerId, type, documentUrl } = req.body;
    if (!sellerId || !type || !documentUrl) {
      return res.status(400).json({ error: 'sellerId, type and documentUrl are required' });
    }
    if (!isValidEntity(db.data.users || [], sellerId)) {
      return res.status(400).json({ error: `Invalid sellerId: ${sellerId}` });
    }

    const duplicate = db.data.complianceDocuments.find((d) => d.sellerId === sellerId && d.type === type);
    if (duplicate) return res.status(400).json({ error: `Compliance document already exists for type: ${type}` });

    const doc = {
      id: `CMP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      sellerId,
      type,
      documentUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.data.complianceDocuments.push(doc);

    const adminUsers = (db.data.users || []).filter((u) => u.role === 'admin' && u.status !== 'inactive');
    adminUsers.forEach((admin) => {
      pushNotificationIfMissing({
        db,
        userId: admin.id,
        title: 'New Compliance Document',
        message: `Seller ${sellerId} uploaded ${type} for verification.`,
        type: 'compliance',
        referenceId: doc.id,
      });
    });

    await db.write();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create compliance document' });
  }
};

export const updateCompliance = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'complianceDocuments');
    const index = db.data.complianceDocuments.findIndex((d) => d.id === id);
    if (index === -1) return res.status(404).json({ error: 'Compliance document not found' });

    const current = db.data.complianceDocuments[index];
    const nextStatus = req.body.status || current.status;
    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ error: `Invalid status: ${nextStatus}` });
    }

    const updated = {
      ...current,
      ...req.body,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };

    if (!isValidEntity(db.data.users || [], updated.sellerId)) {
      return res.status(400).json({ error: `Invalid sellerId: ${updated.sellerId}` });
    }

    const duplicate = db.data.complianceDocuments.find(
      (d) => d.id !== id && d.sellerId === updated.sellerId && d.type === updated.type
    );
    if (duplicate) return res.status(400).json({ error: `Compliance document already exists for type: ${updated.type}` });

    db.data.complianceDocuments[index] = updated;

    if (current.status !== updated.status && ['approved', 'rejected'].includes(updated.status)) {
      pushNotificationIfMissing({
        db,
        userId: updated.sellerId,
        title: `Compliance ${updated.status}`,
        message: `Your ${updated.type} document was ${updated.status}.`,
        type: 'compliance',
        referenceId: updated.id,
      });
    }

    await db.write();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update compliance document' });
  }
};
