const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  email: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
