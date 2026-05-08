const PolicyType = require('../models/PolicyType');
const Policy = require('../models/Policy');

exports.getPolicyTypes = async (req, res, next) => {
  try {
    const types = await PolicyType.find({ isActive: true });
    res.json({ success: true, data: { policyTypes: types } });
  } catch (err) {
    next(err);
  }
};

exports.purchasePolicy = async (req, res, next) => {
  try {
    const { typeId, eventDate, location, tierIndex, contactEmail, contactPhone, paymentMethod, partnerReferral } = req.body;

    if (!typeId || !eventDate || !location || tierIndex === undefined || !contactEmail) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'typeId, eventDate, location, tierIndex, and contactEmail are required.' }
      });
    }

    const parsedEventDate = new Date(eventDate);
    if (parsedEventDate <= new Date()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'event_date must be a future date.' }
      });
    }

    const policyType = await PolicyType.findById(typeId);
    if (!policyType) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Policy type not found.' }
      });
    }

    const tier = policyType.coverageTiers[tierIndex];
    if (!tier) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid coverage tier selected.' }
      });
    }

    const policy = await Policy.create({
      user: req.user._id,
      policyType: policyType._id,
      typeSlug: policyType.slug,
      coverageTier: tier,
      eventDate: parsedEventDate,
      location: { city: location, country: 'Pakistan' },
      contactEmail,
      contactPhone,
      premiumPaid: tier.premium,
      payoutAmount: tier.payoutAmount,
      paymentMethod: paymentMethod || 'card',
      paymentReference: 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      partnerReferral: partnerReferral || undefined
    });

    await policy.populate('policyType', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Policy purchased successfully.',
      data: {
        policy: {
          id: policy._id,
          policyNumber: policy.policyNumber,
          type: policyType.name,
          typeSlug: policyType.slug,
          status: policy.status,
          premiumPaid: policy.premiumPaid,
          payoutAmount: policy.payoutAmount,
          eventDate: policy.eventDate,
          location: policy.location,
          coverageTier: policy.coverageTier
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyPolicies = async (req, res, next) => {
  try {
    const policies = await Policy.find({ user: req.user._id })
      .populate('policyType', 'name slug description triggerCondition')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { policies }
    });
  } catch (err) {
    next(err);
  }
};

exports.getPolicyById = async (req, res, next) => {
  try {
    const policy = await Policy.findOne({ _id: req.params.id, user: req.user._id })
      .populate('policyType', 'name slug description triggerCondition');

    if (!policy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Policy not found.' }
      });
    }

    res.json({ success: true, data: { policy } });
  } catch (err) {
    next(err);
  }
};
