const express = require('express');
const { getFraudFlags } = require('../controllers/fraudController.js');
const authenticate = require('../middlewares/authenticate.js');
const requireRole = require('../middlewares/requireRole.js');

const router = express.Router();

router.get(
  '/',
  authenticate,
  requireRole('admin'),
  getFraudFlags
);

module.exports = router;
