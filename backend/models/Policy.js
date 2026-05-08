const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const policySchema = new mongoose.Schema({
  policyNumber: {
    type: String,
    unique: true,
    default: () => 'POL-' + Math.floor(10000 + Math.random() * 90000)
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policyType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PolicyType',
    required: true
  },
  typeSlug: {
    type: String,
    required: true,
    enum: ['rain-wedding', 'dengue-hospitalization', 'screen-damage']
  },
  coverageTier: {
    label: String,
    premium: Number,
    payoutAmount: Number,
    durationDays: Number
  },
  eventDate: {
    type: Date,
    required: true
  },
  location: {
    city: String,
    country: { type: String, default: 'Pakistan' }
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: String,
  status: {
    type: String,
    enum: ['active', 'claimed', 'expired', 'cancelled'],
    default: 'active'
  },
  premiumPaid: {
    type: Number,
    required: true
  },
  payoutAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'jazzcash', 'easypaisa'],
    default: 'card'
  },
  paymentReference: String,
  partnerReferral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner'
  }
}, { timestamps: true });

policySchema.index({ status: 1, eventDate: 1 });

module.exports = mongoose.model('Policy', policySchema);
