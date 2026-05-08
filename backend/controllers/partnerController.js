const Partner = require('../models/Partner');
const Policy = require('../models/Policy');
const User = require('../models/User');

exports.registerPartner = async (req, res, next) => {
  try {
    const { businessName, contactName, website } = req.body;
    if (!businessName || !contactName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'businessName and contactName are required.' }
      });
    }

    const existing = await Partner.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'DUPLICATE_ERROR', message: 'You are already registered as a partner.' }
      });
    }

    const partner = await Partner.create({
      businessName,
      contactName,
      email: req.user.email,
      phone: req.user.phone,
      website,
      user: req.user._id
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'partner', partnerId: partner._id });

    res.status(201).json({
      success: true,
      message: 'Partner account created successfully.',
      data: { partner }
    });
  } catch (err) {
    next(err);
  }
};

exports.getPartnerDashboard = async (req, res, next) => {
  try {
    const partner = await Partner.findOne({ user: req.user._id });
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Partner account not found.' }
      });
    }

    const policies = await Policy.find({ partnerReferral: partner._id })
      .populate('user', 'fullName email')
      .populate('policyType', 'name slug')
      .sort({ createdAt: -1 });

    const totalSales = policies.length;
    const totalPremium = policies.reduce((sum, p) => sum + p.premiumPaid, 0);
    const commission = totalPremium * (partner.commissionRate / 100);

    res.json({
      success: true,
      data: {
        partner: {
          businessName: partner.businessName,
          referralCode: partner.referralCode,
          commissionRate: partner.commissionRate
        },
        stats: { totalSales, totalPremium, commission },
        policies
      }
    });
  } catch (err) {
    next(err);
  }
};
