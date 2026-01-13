const express = require('express');
const Member = require('../models/Member');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', requireManager, async (req, res) => {
  const { name, domain, email } = req.body;
  if (!name || !domain) return res.status(400).json({ message: 'Missing fields' });
  try {
    const member = await Member.create({ name, domain, email });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort('name');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
