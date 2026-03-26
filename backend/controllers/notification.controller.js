import { getDb } from '../db/index.js';
import { ensureArray, isValidEntity, pushNotificationIfMissing } from './controller.utils.js';

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    const db = await getDb();
    let notifications = db.data.notifications || [];
    if (userId) notifications = notifications.filter((n) => n.userId === userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const db = await getDb();
    ensureArray(db, 'notifications');
    const { userId, title, message, type, referenceId } = req.body;

    if (!userId || !title || !message || !type || !referenceId) {
      return res.status(400).json({ error: 'userId, title, message, type and referenceId are required' });
    }
    if (!isValidEntity(db.data.users || [], userId)) {
      return res.status(400).json({ error: `Invalid userId: ${userId}` });
    }

    pushNotificationIfMissing({ db, userId, title, message, type, referenceId });
    await db.write();

    const created = db.data.notifications.find(
      (n) => n.userId === userId && n.type === type && n.referenceId === referenceId && n.title === title && n.message === message
    );
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'notifications');
    const index = db.data.notifications.findIndex((n) => n.id === id);
    if (index === -1) return res.status(404).json({ error: 'Notification not found' });

    db.data.notifications[index] = {
      ...db.data.notifications[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await db.write();
    res.json(db.data.notifications[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    ensureArray(db, 'notifications');
    const originalLength = db.data.notifications.length;
    db.data.notifications = db.data.notifications.filter((n) => n.id !== id);
    if (db.data.notifications.length === originalLength) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
