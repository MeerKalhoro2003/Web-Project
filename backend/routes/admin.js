const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticate');
const requireRole = require('../middlewares/requireRole');

router.use(authenticate, requireRole('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/block', adminController.blockUser);
router.get('/policies', adminController.getAllPolicies);
router.get('/claims', adminController.getAllClaims);
router.get('/policy-types', adminController.getPolicyTypes);
router.put('/policy-types/:id', adminController.updatePolicyType);
router.get('/partners', adminController.getAllPartners);

module.exports = router;
