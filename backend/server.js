const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const postRoutes = require('./routes/posts');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const notificationsRouter = require('./routes/notifications');
const cron = require('node-cron');


//env er configeration file 
dotenv.config();
connectDB();


const app = express();


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());



app.use('/posts', postRoutes)
app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/notifications', notificationsRouter);

//to do its added for notificaTION 
app.get('/auth/check', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ message: 'Authenticated' });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
});


cron.schedule('0 0 * * *', async () => {  // Runs at midnight every day
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const result = await Notification.deleteMany({ createdAt: { $lt: oneWeekAgo } });
    console.log(`${result.deletedCount} old notifications deleted successfully`);
  } catch (err) {
    console.error('Error deleting old notifications:', err);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
