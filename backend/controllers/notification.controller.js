import { getDb } from '../db/index.js';

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    const db = await getDb();
    let notifications = db.data.notifications || [];
    if (userId) notifications = notifications.filter(n => n.userId === userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
