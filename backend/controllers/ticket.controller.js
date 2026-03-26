import { getDb } from '../db/index.js';
import crypto from 'crypto';
import { ensureArray, isValidEntity, pushNotificationIfMissing } from './controller.utils.js';

const allowedTicketTransitions = {
  open: ['in_progress'],
  in_progress: ['resolved'],
  resolved: [],
};

export const getTickets = async (req, res) => {
  try {
    const { userId, status } = req.query;
    const db = await getDb();
    let tickets = db.data.tickets || [];
    if (userId) tickets = tickets.filter((t) => t.userId === userId);
    if (status) tickets = tickets.filter((t) => t.status === status);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

export const createTicket = async (req, res) => {
  try {
    const db = await getDb();
    ensureArray(db, 'tickets');

    if (!req.body.userId) return res.status(400).json({ error: 'userId is required' });
    if (!isValidEntity(db.data.users || [], req.body.userId)) {
      return res.status(400).json({ error: `Invalid userId: ${req.body.userId}` });
    }

    const ticket = {
      id: `TKT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      status: 'open',
      priority: req.body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body,
    };

    db.data.tickets.push(ticket);
    await db.write();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'tickets');
    const index = db.data.tickets.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Ticket not found' });

    const current = db.data.tickets[index];
    if (req.body.status && req.body.status !== current.status) {
      const allowed = allowedTicketTransitions[current.status] || [];
      if (!allowed.includes(req.body.status)) {
        return res.status(400).json({ error: `Invalid ticket transition from ${current.status} to ${req.body.status}` });
      }
    }

    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    if (!updated.userId || !isValidEntity(db.data.users || [], updated.userId)) {
      return res.status(400).json({ error: `Invalid userId: ${updated.userId}` });
    }

    db.data.tickets[index] = updated;

    if (req.body.response || req.body.status === 'resolved' || req.body.status === 'in_progress') {
      pushNotificationIfMissing({
        db,
        userId: updated.userId,
        title: 'Support Ticket Updated',
        message: `Ticket ${updated.id} is now ${updated.status}.`,
        type: 'ticket',
        referenceId: updated.id,
      });
    }

    await db.write();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
};
