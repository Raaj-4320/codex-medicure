import { getDb } from '../db/index.js';
import crypto from 'crypto';
import { ensureArray, findById, getPharmacySellerId, isValidEntity, pushNotificationIfMissing } from './controller.utils.js';

const allowedTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['packed'],
  packed: ['ready'],
  ready: ['on_the_way'],
  on_the_way: ['picked_up', 'delivered'],
  picked_up: ['delivered'],
  delivered: [],
  cancelled: [],
};

const validateOrderReferences = (db, payload) => {
  const customerId = payload.userId || payload.customerId;
  if (!customerId) return 'userId/customerId is required';
  if (!isValidEntity(db.data.users || [], customerId)) return `Invalid userId: ${customerId}`;

  if (!payload.pharmacyId) return 'pharmacyId is required';
  if (!isValidEntity(db.data.pharmacies || [], payload.pharmacyId)) return `Invalid pharmacyId: ${payload.pharmacyId}`;

  if (payload.prescriptionId) {
    const prescription = findById(db.data.prescriptions || [], payload.prescriptionId);
    if (!prescription) return `Invalid prescriptionId: ${payload.prescriptionId}`;
    if (prescription.userId !== customerId) return 'prescriptionId does not belong to the provided userId/customerId';
    if (prescription.pharmacyId !== payload.pharmacyId) return 'prescriptionId does not belong to the provided pharmacyId';
  }

  return null;
};

export const getOrders = async (req, res) => {
  try {
    const { id, customerId, pharmacyId, status, userId } = req.query;
    const db = await getDb();
    let orders = db.data.orders || [];
    if (id) orders = orders.filter((o) => o.id === id);
    if (customerId) orders = orders.filter((o) => o.customerId === customerId);
    if (userId) orders = orders.filter((o) => o.customerId === userId);
    if (pharmacyId) orders = orders.filter((o) => o.pharmacyId === pharmacyId);
    if (status) orders = orders.filter((o) => o.status === status);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const order = (db.data.orders || []).find((o) => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const db = await getDb();
    ensureArray(db, 'orders');
    const now = new Date().toISOString();

    const newOrder = {
      ...req.body,
      id: req.body.id || `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      customerId: req.body.customerId || req.body.userId,
      userId: req.body.userId || req.body.customerId,
      createdAt: now,
      updatedAt: now,
      status: req.body.status || 'pending',
    };

    const refError = validateOrderReferences(db, newOrder);
    if (refError) return res.status(400).json({ error: refError });

    db.data.orders.push(newOrder);

    const { pharmacy, sellerId } = getPharmacySellerId(db, newOrder.pharmacyId);
    if (pharmacy && sellerId) {
      pushNotificationIfMissing({
        db,
        userId: sellerId,
        title: 'New Order Received',
        message: `New order ${newOrder.id} has been placed.`,
        type: 'order',
        referenceId: newOrder.id,
      });
    }

    await db.write();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'orders');
    const index = db.data.orders.findIndex((o) => o.id === id);
    if (index === -1) return res.status(404).json({ error: 'Order not found' });

    const current = db.data.orders[index];
    const nextStatus = req.body.status;
    if (nextStatus && nextStatus !== current.status) {
      const allowed = allowedTransitions[current.status] || [];
      if (!allowed.includes(nextStatus)) {
        return res.status(400).json({ error: `Invalid status transition from ${current.status} to ${nextStatus}` });
      }
    }

    const updatedOrder = {
      ...current,
      ...req.body,
      userId: req.body.userId || req.body.customerId || current.userId || current.customerId,
      customerId: req.body.customerId || req.body.userId || current.customerId || current.userId,
      updatedAt: new Date().toISOString(),
    };

    const refError = validateOrderReferences(db, updatedOrder);
    if (refError) return res.status(400).json({ error: refError });

    db.data.orders[index] = updatedOrder;

    const { pharmacy, sellerId } = getPharmacySellerId(db, updatedOrder.pharmacyId);
    const notifyTargets = [updatedOrder.customerId, sellerId].filter(Boolean);
    notifyTargets.forEach((targetId) => {
      pushNotificationIfMissing({
        db,
        userId: targetId,
        title: 'Order Status Updated',
        message: `Order ${updatedOrder.id} status changed to ${updatedOrder.status}.`,
        type: 'order',
        referenceId: updatedOrder.id,
      });
    });

    if (updatedOrder.status === 'delivered') {
      ensureArray(db, 'payouts');
      const payoutExists = db.data.payouts.some((p) => p.orderId === updatedOrder.id);
      if (!payoutExists) {
        if (!sellerId) {
          return res.status(400).json({ error: 'Cannot create payout: sellerId not found for pharmacy' });
        }
        const amount = Number(updatedOrder.totalAmount || 0);
        const netAmount = Math.round(amount * 0.9 * 100) / 100;
        const payout = {
          id: `PYO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          orderId: updatedOrder.id,
          sellerId,
          pharmacyId: pharmacy.id,
          amount,
          commission: Math.round((amount - netAmount) * 100) / 100,
          gst: 0,
          netAmount,
          status: 'pending',
          periodStart: new Date().toISOString().slice(0, 10),
          periodEnd: new Date().toISOString().slice(0, 10),
          createdAt: new Date().toISOString(),
        };
        db.data.payouts.push(payout);
        pushNotificationIfMissing({
          db,
          userId: sellerId,
          title: 'Payout Created',
          message: `Payout ${payout.id} created for delivered order ${updatedOrder.id}.`,
          type: 'payout',
          referenceId: payout.orderId,
        });
      }
    }

    await db.write();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'orders');
    const originalLength = db.data.orders.length;
    db.data.orders = db.data.orders.filter((o) => o.id !== id);
    if (db.data.orders.length === originalLength) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
