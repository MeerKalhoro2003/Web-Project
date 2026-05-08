const Claim = require('../models/Claim.js');
const FraudFlag = require('../models/FraudFlag.js');

exports.checkFraudRules = async (claim, user) => {
  // Rule 1: High-value claim
  if (claim.amount > 1000000) {
    await FraudFlag.create({
      user: user._id,
      claim: claim._id,
      reason: 'High-value claim detected',
      severity: 'high',
    });
  }

  // Rule 2: Multiple recent claims
  const recentClaims = await Claim.countDocuments({
    user: user._id,
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  if (recentClaims >= 3) {
    await FraudFlag.create({
      user: user._id,
      claim: claim._id,
      reason: 'Multiple claims submitted in 24 hours',
      severity: 'medium',
    });
  }

  // Rule 3: New account with large claim
  const accountAgeDays =
    (Date.now() - new Date(user.createdAt)) /
    (1000 * 60 * 60 * 24);

  if (accountAgeDays < 7 && claim.amount > 500000) {
    await FraudFlag.create({
      user: user._id,
      claim: claim._id,
      reason: 'New account submitted large claim',
      severity: 'high',
    });
  }
};
