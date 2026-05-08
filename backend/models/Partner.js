const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const partnerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  contactName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: String,
  website: String,
  referralCode: {
    type: String,
    unique: true,
    default: () => 'TKP-' + Math.random().toString(36).substring(2, 8).toUpperCase()
  },
  commissionRate: {
    type: Number,
    default: 10
  },
  totalCommissionEarned: {
    type: Number,
    default: 0
  },
  totalPoliciesSold: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
