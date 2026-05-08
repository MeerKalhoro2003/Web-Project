const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'triggered', 'paid', 'not_triggered', 'failed'],
    default: 'pending'
  },
  triggerData: {
    rainfallMm: Number,
    location: String,
    threshold: Number,
    checkedAt: Date,
    apiSource: String
  },
  claimTriggered: {
    type: Boolean,
    default: false
  },
  payoutAmount: Number,
  payoutReference: String,
  notes: String,
  processedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
