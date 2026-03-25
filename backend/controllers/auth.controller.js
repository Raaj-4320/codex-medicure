import { getDb } from '../db/index.js';

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    const db = await getDb();
    const user = db.data.users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
