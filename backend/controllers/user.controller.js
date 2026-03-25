import { getDb } from '../db/index.js';

export const getUsers = async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.data.users || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req, res) => {
  try {
    const db = await getDb();
    const newUser = {
      id: `user-${Date.now()}`,
      ...req.body,
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
    const index = db.data.users.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    db.data.users[index] = { ...db.data.users[index], ...req.body, updatedAt: new Date().toISOString() };
    await db.write();
    res.json(db.data.users[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};
