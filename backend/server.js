require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const meetingRoutes = require('./routes/meetings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/meetings', meetingRoutes);

const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch(err => {
    console.error('DB connection error', err.message);
  });
