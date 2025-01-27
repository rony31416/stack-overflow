const express = require('express');
const {
  getNotifications,
  markNotification,
  createNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/:userId', getNotifications);
router.put('/:id/mark', markNotification);
router.post('/', createNotification);

module.exports = router;
