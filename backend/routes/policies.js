const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const authenticate = require('../middlewares/authenticate');

router.get('/types', policyController.getPolicyTypes);
router.post('/purchase', authenticate, policyController.purchasePolicy);
router.get('/my', authenticate, policyController.getMyPolicies);
router.get('/:id', authenticate, policyController.getPolicyById);

module.exports = router;
