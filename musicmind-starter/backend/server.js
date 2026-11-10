require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/auth', authRoutes);
app.use('/api', dataRoutes);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`MusicMind backend running at http://127.0.0.1:${PORT}`);
  console.log(`Login flow: http://127.0.0.1:${PORT}/auth/login`);
});
