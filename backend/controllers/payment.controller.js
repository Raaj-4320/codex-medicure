import { getDb } from '../db/index.js';
import crypto from 'crypto';

export const processPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    const db = await getDb();
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
