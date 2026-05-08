const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const authenticate = require('../middlewares/authenticate');

router.post('/check/:id', authenticate, claimController.checkClaim);
router.get('/status/:id', authenticate, claimController.getClaimStatus);

module.exports = router;
