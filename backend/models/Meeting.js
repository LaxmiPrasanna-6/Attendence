const mongoose = require('mongoose');

const AttendanceSub = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'absent' }
});

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  venue: { type: String },
  date: { type: Date, required: true },
  attendees: [AttendanceSub]
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);
