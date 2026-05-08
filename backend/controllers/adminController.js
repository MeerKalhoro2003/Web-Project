const User = require('../models/User');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Partner = require('../models/Partner');
const PolicyType = require('../models/PolicyType');
const { createAuditLog } = require('../utils/createAuditLog.js');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, blockedUsers, totalPolicies, activePolicies, claimedPolicies, totalPartners] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ isBlocked: false, role: { $ne: 'admin' } }),
      User.countDocuments({ isBlocked: true }),
      Policy.countDocuments(),
      Policy.countDocuments({ status: 'active' }),
      Policy.countDocuments({ status: 'claimed' }),
      Partner.countDocuments()
    ]);

    const premiumRevenue = await Policy.aggregate([
      { $group: { _id: null, total: { $sum: '$premiumPaid' } } }
    ]);

    const payoutsTotal = await Claim.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$payoutAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          blockedUsers,
          totalPolicies,
          activePolicies,
          claimedPolicies,
          totalPartners,
          totalPremiumRevenue: premiumRevenue[0]?.total || 0,
          totalPayouts: payoutsTotal[0]?.total || 0
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, blocked, page = 1, limit = 20 } = req.query;
    const query = { role: { $ne: 'admin' } };
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (blocked !== undefined) {
      query.isBlocked = blocked === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password -otp').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: { users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp');
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });
    }
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });
    if (user.role === 'admin') return res.status(400).json({ success: false, error: { code: 'FORBIDDEN', message: 'Cannot block an admin.' } });
    
    user.isBlocked = true;
    await user.save();
    
    await createAuditLog({
      admin: req.user.id,
      action: 'Blocked user',
      targetType: 'User',
      targetId: user._id,
    });

    res.json({ success: true, message: 'User blocked successfully.', data: { isBlocked: user.isBlocked } });
  } catch (err) {
    next(err);
  }
};

exports.unblockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });
    
    user.isBlocked = false;
    await user.save();
    res.json({ success: true, message: 'User unblocked successfully.', data: { isBlocked: user.isBlocked } });
  } catch (err) {
    next(err);
  }
};

exports.getAllPolicies = async (req, res, next) => {
  try {
    const { status, typeSlug, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (typeSlug) query.typeSlug = typeSlug;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [policies, total] = await Promise.all([
      Policy.find(query)
        .populate('user', 'fullName email phone')
        .populate('policyType', 'name slug')
        .skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      Policy.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: { policies, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find()
      .populate('user', 'fullName email')
      .populate({ path: 'policy', populate: { path: 'policyType', select: 'name slug' } })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { claims } });
  } catch (err) {
    next(err);
  }
};

exports.getPolicyTypes = async (req, res, next) => {
  try {
    const types = await PolicyType.find();
    res.json({ success: true, data: { policyTypes: types } });
  } catch (err) {
    next(err);
  }
};

exports.updatePolicyType = async (req, res, next) => {
  try {
    const policyType = await PolicyType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!policyType) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Policy type not found.' } });
    }
    res.json({ success: true, data: { policyType } });
  } catch (err) {
    next(err);
  }
};

exports.getAllPartners = async (req, res, next) => {
  try {
    const partners = await Partner.find().populate('user', 'fullName email').sort({ createdAt: -1 });
    res.json({ success: true, data: { partners } });
  } catch (err) {
    next(err);
  }
};
