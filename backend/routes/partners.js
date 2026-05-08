const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const authenticate = require('../middlewares/authenticate');

router.post('/register', authenticate, partnerController.registerPartner);
router.get('/dashboard', authenticate, partnerController.getPartnerDashboard);

module.exports = router;
