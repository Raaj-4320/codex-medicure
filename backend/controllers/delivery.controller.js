import { getDb } from '../db/index.js';
import crypto from 'crypto';

export const getAssignments = async (req, res) => {
  try {
    const { deliveryStaffId, status } = req.query;
    const db = await getDb();
    let assignments = db.data.deliveryAssignments || [];
    if (deliveryStaffId) assignments = assignments.filter(a => a.deliveryStaffId === deliveryStaffId);
    if (status) assignments = assignments.filter(a => a.status === status);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const db = await getDb();
    const newAssignment = {
      ...req.body,
      id: `ASG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      assignedAt: new Date().toISOString(),
      pickupOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'assigned'
    };
    db.data.deliveryAssignments.push(newAssignment);
    await db.write();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const index = db.data.deliveryAssignments.findIndex(a => a.id === id);
    if (index !== -1) {
      db.data.deliveryAssignments[index] = { ...db.data.deliveryAssignments[index], ...req.body };
      await db.write();
      res.json(db.data.deliveryAssignments[index]);
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update assignment' });
  }
};
