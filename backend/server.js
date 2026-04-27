const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const db = require('./app/models');
const seedDemoData = require('./app/utils/seedDemoData');

const app = express();

// Allow the Vite development server to send/receive authentication cookies.
const corsOption = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true
};

app.use(cors(corsOption));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple endpoint used to verify that the backend is running.
app.get('/api/health', (req, res) => {
  res.json({ status: 'MyEvents backend is running smoothly!' });
});

// Routes are registered in the same app/routes style used in class.
require('./app/routes/user.route')(app);
require('./app/routes/event.route')(app);
require('./app/routes/task.route')(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);

  try {
    // Sequelize creates/updates tables from the models, then seeds demo data.
    await db.connex.sync();
    console.log('Database models synced with Sequelize');
    await seedDemoData();
  } catch (error) {
    console.error('Startup setup error:', error);
  }
});
