const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
console.log("🔥 NEW SERVER VERSION RUNNING — CORS MIRROR ENABLED");
console.log("🔥🔥🔥 THIS SERVER FILE IS RUNNING 🔥🔥🔥");

dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(express.json());

// --- UNIVERSAL CORS FIX ---
// This setting automatically mirrors the requester's origin, 
// which is the most reliable way to handle Live Server vs Localhost issues.
app.use(cors({
    origin: true, 
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected...');
   await sequelize.sync();

    console.log('✅ Database models synchronized.');

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🛠️  CORS is currently allowing all local origins.`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();