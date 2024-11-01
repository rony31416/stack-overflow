const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ userId, isRead: false }); // Adjust query as needed
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

// Mark notification as read
router.put('/:id/mark', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create notification for new post 
router.post('/', async (req, res) => {
  const { userId, message } = req.body; 
  if (!userId || !message) {
    return res.status(400).json({ message: 'User ID and message are required' });
  }

  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
