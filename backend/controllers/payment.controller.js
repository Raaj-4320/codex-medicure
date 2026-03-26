import { getDb } from '../db/index.js';
import crypto from 'crypto';

export const getPayments = async (req, res) => {
  try {
    const { orderId, sellerId } = req.query;
    const db = await getDb();
    let payments = db.data.payments || [];

    if (orderId) payments = payments.filter((p) => p.orderId === orderId);
    if (sellerId) {
      const orders = db.data.orders || [];
      const sellerPharmacies = (db.data.pharmacies || []).filter((p) => p.sellerId === sellerId).map((p) => p.id);
      const sellerOrderIds = orders.filter((o) => sellerPharmacies.includes(o.pharmacyId)).map((o) => o.id);
      payments = payments.filter((p) => sellerOrderIds.includes(p.orderId));
    }

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    const db = await getDb();
    db.data.payments ||= [];
    const newPayment = {
      id: `PAY-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      orderId,
      amount,
      method,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    db.data.payments.push(newPayment);
    await db.write();
    res.status(201).json({
      success: true,
      transactionId: newPayment.id,
      payment: newPayment
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
};
