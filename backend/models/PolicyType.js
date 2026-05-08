const mongoose = require('mongoose');

const policyTypeSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    enum: ['rain-wedding', 'dengue-hospitalization', 'screen-damage']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverageTiers: [
    {
      label: String,
      premium: Number,
      payoutAmount: Number,
      durationDays: Number
    }
  ],
  triggerCondition: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PolicyType', policyTypeSchema);
