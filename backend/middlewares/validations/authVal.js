const { body } = require('express-validator');

exports.registerRules = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 0 })
    .withMessage('Password must be at least 8 characters with letters and numbers'),
  body('cnic').matches(/^\d{5}-\d{7}-\d{1}$/).withMessage('CNIC must be in format XXXXX-XXXXXXX-X'),
  body('phone').matches(/^(\+92|0)?3[0-9]{9}$/).withMessage('Please provide a valid Pakistani phone number')
];

exports.changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isStrongPassword({ minLength: 8 }).withMessage('New password must be at least 8 characters')
];
