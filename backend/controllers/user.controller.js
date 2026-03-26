import { getDb } from '../db/index.js';

export const getUsers = async (req, res) => {
  try {
    const { id, role } = req.query;
    const db = await getDb();
    let users = db.data.users || [];
    if (id) users = users.filter((u) => (u.id || u.uid) === id);
    if (role) users = users.filter((u) => u.role === role);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req, res) => {
  try {
    const db = await getDb();
    const id = req.body.id || req.body.uid;

    if (!id || !req.body.email) {
      return res.status(400).json({ error: 'id(uid) and email are required' });
    }

    const existingIndex = db.data.users.findIndex((u) => (u.id || u.uid) === id);
    if (existingIndex >= 0) {
      db.data.users[existingIndex] = {
        ...db.data.users[existingIndex],
        ...req.body,
        id,
        uid: id,
        updatedAt: new Date().toISOString(),
      };
      await db.write();
      return res.json(db.data.users[existingIndex]);
    }

    const newUser = {
      ...req.body,
      id,
      uid: id,
      addresses: req.body.addresses || [],
      role: req.body.role || 'customer',
      status: req.body.status || 'active',
      createdAt: new Date().toISOString()
    };
    db.data.users.push(newUser);
    await db.write();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const index = db.data.users.findIndex(u => (u.id || u.uid) === id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    db.data.users[index] = {
      ...db.data.users[index],
      ...req.body,
      id,
      uid: id,
      updatedAt: new Date().toISOString(),
    };
    await db.write();
    res.json(db.data.users[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const originalLength = db.data.users.length;
    db.data.users = db.data.users.filter((u) => (u.id || u.uid) !== id);
    if (db.data.users.length === originalLength) return res.status(404).json({ error: 'User not found' });
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
