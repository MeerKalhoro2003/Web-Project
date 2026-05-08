const FraudFlag = require('../models/FraudFlag.js');

exports.getFraudFlags = async (req, res) => {
  try {
    const flags = await FraudFlag.find()
      .populate('user')
      .populate('claim')
      .sort({ createdAt: -1 });

    res.json(flags);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
