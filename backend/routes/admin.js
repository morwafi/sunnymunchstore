const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// Check if admin exists
router.get('/exists', async (req, res) => {
  const exists = await Admin.exists({});
  res.json({ exists: !!exists });
});

// Register first admin
router.post('/register', async (req, res) => {
  const exists = await Admin.exists({});
  if (exists) return res.status(403).json({ error: 'Admin already exists' });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await Admin.create({ username: req.body.username, password: hashedPassword });
  res.json({ success: true });
});

// Login admin
router.post('/login', async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin) return res.json({ success: false });

  const match = await bcrypt.compare(req.body.password, admin.password);
  if (!match) return res.json({ success: false });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ success: true });
});

module.exports = router;
