import { getDb } from '../db/index.js';
import crypto from 'crypto';

export const getOrders = async (req, res) => {
  try {
    const { customerId, pharmacyId, status } = req.query;
    const db = await getDb();
    let orders = db.data.orders || [];
    if (customerId) orders = orders.filter(o => o.customerId === customerId);
    if (pharmacyId) orders = orders.filter(o => o.pharmacyId === pharmacyId);
    if (status) orders = orders.filter(o => o.status === status);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const db = await getDb();
    const newOrder = {
      ...req.body,
      id: `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    db.data.orders.push(newOrder);
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
    const index = db.data.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      db.data.orders[index] = { ...db.data.orders[index], ...req.body };
      await db.write();
      res.json(db.data.orders[index]);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};
