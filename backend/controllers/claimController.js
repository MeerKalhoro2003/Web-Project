const axios = require('axios');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Notification = require('../models/Notification.js');
const { checkFraudRules } = require('../utils/fraudDetection.js');

const RAIN_THRESHOLD_MM = 5;

const fetchRainfallData = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'your_openweathermap_api_key') {
    const simulatedRainfall = Math.random() * 20;
    return {
      rainfallMm: parseFloat(simulatedRainfall.toFixed(2)),
      location: city,
      source: 'simulated'
    };
  }
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},pk&appid=${apiKey}&units=metric`
  );
  const rain = response.data.rain ? response.data.rain['1h'] || 0 : 0;
  return {
    rainfallMm: rain,
    location: city,
    source: 'openweathermap'
  };
};

exports.checkClaim = async (req, res, next) => {
  try {
    const policy = await Policy.findOne({ _id: req.params.id, user: req.user._id })
      .populate('policyType');

    if (!policy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Policy not found.' }
      });
    }

    if (policy.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATE', message: `Policy is already ${policy.status}.` }
      });
    }

    const existingClaim = await Claim.findOne({ policy: policy._id });
    if (existingClaim && existingClaim.status === 'paid') {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_CLAIMED', message: 'This policy has already been claimed.' }
      });
    }

    let triggerData = {};
    let claimTriggered = false;

    if (policy.typeSlug === 'rain-wedding') {
      const weatherData = await fetchRainfallData(policy.location.city);
      triggerData = {
        rainfallMm: weatherData.rainfallMm,
        location: weatherData.location,
        threshold: RAIN_THRESHOLD_MM,
        checkedAt: new Date(),
        apiSource: weatherData.source
      };
      claimTriggered = weatherData.rainfallMm >= RAIN_THRESHOLD_MM;
    } else if (policy.typeSlug === 'dengue-hospitalization') {
      claimTriggered = false;
      triggerData = {
        rainfallMm: 0,
        location: policy.location.city,
        threshold: 0,
        checkedAt: new Date(),
        apiSource: 'manual-review',
        notes: 'Dengue hospitalization requires manual confirmation from hospital records.'
      };
    } else if (policy.typeSlug === 'screen-damage') {
      claimTriggered = false;
      triggerData = {
        rainfallMm: 0,
        location: policy.location.city,
        threshold: 0,
        checkedAt: new Date(),
        apiSource: 'manual-review',
        notes: 'Screen damage requires submission of repair invoice.'
      };
    }

    let claim = await Claim.findOne({ policy: policy._id });
    if (!claim) {
      claim = new Claim({
        policy: policy._id,
        user: req.user._id,
        triggerData,
        claimTriggered
      });
    } else {
      claim.triggerData = triggerData;
      claim.claimTriggered = claimTriggered;
    }

    if (claimTriggered) {
      claim.status = 'paid';
      claim.payoutAmount = policy.payoutAmount;
      claim.payoutReference = 'PAY-OUT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      claim.processedAt = new Date();
      policy.status = 'claimed';
      await Notification.create({
        user: claim.user,
        title: 'Claim Approved',
        message: 'Your insurance claim has been approved.',
        type: 'claim',
      });
    } else {
      claim.status = 'not_triggered';
    }

    await claim.save();
    await checkFraudRules(claim, req.user);
    await policy.save();

    res.json({
      success: true,
      data: {
        policyId: policy._id,
        policyNumber: policy.policyNumber,
        weatherData: triggerData,
        thresholdMm: RAIN_THRESHOLD_MM,
        claimTriggered,
        payout: claimTriggered ? policy.payoutAmount : 0,
        status: claim.status
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getClaimStatus = async (req, res, next) => {
  try {
    const policy = await Policy.findOne({ _id: req.params.id, user: req.user._id });
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Policy not found.' }
      });
    }

    const claim = await Claim.findOne({ policy: policy._id });
    if (!claim) {
      return res.json({
        success: true,
        data: { status: 'no_claim', message: 'No claim has been processed for this policy yet.' }
      });
    }

    res.json({ success: true, data: { claim } });
  } catch (err) {
    next(err);
  }
};
