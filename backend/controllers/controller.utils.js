import crypto from 'crypto';

export const ACTIVE_RETURN_STATUSES = ['pending', 'approved', 'picked_up'];
export const ACTIVE_PRESCRIPTION_STATUSES = ['pending', 'approved'];

export const ensureArray = (db, key) => {
  db.data[key] ||= [];
  return db.data[key];
};

export const findById = (collection = [], id) => collection.find((item) => item.id === id);

export const isValidEntity = (collection = [], id) => Boolean(id) && collection.some((item) => item.id === id);

export const getPharmacySellerId = (db, pharmacyId) => {
  const pharmacy = (db.data.pharmacies || []).find((p) => p.id === pharmacyId);
  return { pharmacy, sellerId: pharmacy?.sellerId || null };
};

export const pushNotificationIfMissing = ({ db, userId, title, message, type, referenceId }) => {
  if (!userId || !type || !referenceId) return;
  ensureArray(db, 'notifications');

  const duplicate = db.data.notifications.some(
    (n) =>
      n.userId === userId &&
      n.type === type &&
      n.referenceId === referenceId &&
      n.title === title &&
      n.message === message
  );

  if (duplicate) return;

  db.data.notifications.push({
    id: `NOT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    userId,
    title,
    message,
    type,
    referenceId,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
};
