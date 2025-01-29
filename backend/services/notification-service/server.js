const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5003', 'http://localhost:5002', 'http://localhost:5001', 'http://localhost:5000',],
  // origin: true,
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());

app.use('/notifications', notificationRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
