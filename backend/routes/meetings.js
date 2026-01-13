const express = require('express');
const Meeting = require('../models/Meeting');
const Member = require('../models/Member');
const { auth, requireManager } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Create meeting and auto-load all members as attendees
router.post('/', requireManager, async (req, res) => {
  const { title, venue, date } = req.body;
  if (!title || !date) return res.status(400).json({ message: 'Missing fields' });
  try {
    const members = await Member.find();
    const attendees = members.map(m => ({ member: m._id, status: 'absent' }));
    const meeting = await Meeting.create({ title, venue, date, attendees });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().populate('attendees.member', 'name domain email').sort({ date: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark attendance: body { memberId, status }
router.put('/:id/attendance', requireManager, async (req, res) => {
  const { id } = req.params;
  const { memberId, status } = req.body;
  if (!memberId || !status) return res.status(400).json({ message: 'Missing fields' });
  try {
    const meeting = await Meeting.findById(id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    const att = meeting.attendees.find(a => a.member.toString() === memberId);
    if (!att) return res.status(404).json({ message: 'Member not in meeting' });
    att.status = status === 'present' ? 'present' : 'absent';
    await meeting.save();
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard stats: total meetings, per-member counts
router.get('/stats/summary', requireManager, async (req, res) => {
  try {
    const meetings = await Meeting.find();
    const totalMeetings = meetings.length;
    const members = await Member.find();
    const stats = await Promise.all(members.map(m => {
      let presents = 0;
      meetings.forEach(meet => {
        const att = meet.attendees.find(a => a.member.toString() === m._id.toString());
        if (att && att.status === 'present') presents++;
      });
      const absents = totalMeetings - presents;
      const pct = totalMeetings === 0 ? 0 : Math.round((presents / totalMeetings) * 100);
      return { memberId: m._id, name: m.name, domain: m.domain, email: m.email, totalMeetings, presents, absents, percentage: pct };
    }));
    res.json({ totalMeetings, members: stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export summary as CSV (opens in Excel)
router.get('/export/summary.csv', requireManager, async (req, res) => {
  try {
    const meetings = await Meeting.find();
    const totalMeetings = meetings.length;
    const members = await Member.find();
    const stats = await Promise.all(members.map(m => {
      let presents = 0;
      meetings.forEach(meet => {
        const att = meet.attendees.find(a => a.member.toString() === m._id.toString());
        if (att && att.status === 'present') presents++;
      });
      const absents = totalMeetings - presents;
      const pct = totalMeetings === 0 ? 0 : Math.round((presents / totalMeetings) * 100);
      return { name: m.name, domain: m.domain, email: m.email, totalMeetings, presents, absents, percentage: pct };
    }));

    const header = ['Name','Domain','Email','TotalMeetings','Presents','Absents','Percentage'];
    const rows = stats.map(s => [s.name, s.domain || '', s.email || '', s.totalMeetings, s.presents, s.absents, s.percentage]);
    const csv = [header, ...rows].map(r => r.map(field => {
      if (field === null || field === undefined) return '';
      const str = String(field).replace(/"/g, '""');
      if (str.includes(',') || str.includes('\n') || str.includes('"')) return `"${str}"`;
      return str;
    }).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance-summary.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
