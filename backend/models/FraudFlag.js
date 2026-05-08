const mongoose = require('mongoose');

const fraudFlagSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
    },
    reason: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FraudFlag', fraudFlagSchema);
