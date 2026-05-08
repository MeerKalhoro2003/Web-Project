const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report-controller');
const authenticate = require('../middlewares/authenticate');

router.use(authenticate);
router.get('/user-dashboard', reportController.getUserDashboard);

module.exports = router;
