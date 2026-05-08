const Policy = require('../models/Policy');
const Claim = require('../models/Claim');

exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [activePolicies, totalClaims, paidClaims] = await Promise.all([
      Policy.countDocuments({ user: userId, status: 'active' }),
      Claim.countDocuments({ user: userId }),
      Claim.aggregate([
        { $match: { user: userId, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$payoutAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        activePolicies,
        totalClaims,
        totalPayoutsReceived: paidClaims[0]?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
};
