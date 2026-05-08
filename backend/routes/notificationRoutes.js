const express = require('express');
const {
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markAsRead);

module.exports = router;