const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { registerRules, changePasswordRules } = require('../middlewares/validations/authVal');

router.post('/register', registerRules, validate, authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.put('/change-password', authenticate, changePasswordRules, validate, authController.changePassword);
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
