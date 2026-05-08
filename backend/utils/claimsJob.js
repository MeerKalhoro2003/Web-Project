const cron = require('node-cron');
const axios = require('axios');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');

const RAIN_THRESHOLD_MM = 5;

const weatherCache = new Map();

const fetchWeather = async (city) => {
  const cacheKey = `${city}-${new Date().toISOString().split('T')[0]}`;
  if (weatherCache.has(cacheKey)) {
    return weatherCache.get(cacheKey);
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  let rainfallMm = 0;

  if (!apiKey || apiKey === 'your_openweathermap_api_key') {
    rainfallMm = parseFloat((Math.random() * 15).toFixed(2));
  } else {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},pk&appid=${apiKey}&units=metric`
      );
      rainfallMm = response.data.rain ? response.data.rain['1h'] || 0 : 0;
    } catch (err) {
      console.error(`Weather API error for ${city}:`, err.message);
    }
  }

  weatherCache.set(cacheKey, rainfallMm);
  return rainfallMm;
};

const processDailyRainClaims = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const duePolicies = await Policy.find({
    status: 'active',
    typeSlug: 'rain-wedding',
    eventDate: { $gte: today, $lt: tomorrow }
  });

  console.log(`[Claims Job] Processing ${duePolicies.length} rain policies for today.`);

  for (const policy of duePolicies) {
    try {
      const rainfallMm = await fetchWeather(policy.location.city);
      const triggered = rainfallMm >= RAIN_THRESHOLD_MM;

      const claim = await Claim.create({
        policy: policy._id,
        user: policy.user,
        triggerData: {
          rainfallMm,
          location: policy.location.city,
          threshold: RAIN_THRESHOLD_MM,
          checkedAt: new Date(),
          apiSource: 'cron-job'
        },
        claimTriggered: triggered,
        status: triggered ? 'paid' : 'not_triggered',
        payoutAmount: triggered ? policy.payoutAmount : 0,
        payoutReference: triggered ? 'AUTO-PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase() : undefined,
        processedAt: new Date()
      });

      if (triggered) {
        policy.status = 'claimed';
        await policy.save();
        console.log(`[Claims Job] Auto-claim triggered for policy ${policy.policyNumber} - payout: ${policy.payoutAmount}`);
      }
    } catch (err) {
      console.error(`[Claims Job] Error processing policy ${policy.policyNumber}:`, err.message);
    }
  }
};

const job = {
  start: () => {
    cron.schedule('0 2 * * *', async () => {
      console.log('[Claims Job] Running nightly claims check...');
      await processDailyRainClaims();
      console.log('[Claims Job] Nightly check complete.');
    });
    console.log('[Claims Job] Scheduled nightly at 2:00 AM.');
  }
};

module.exports = job;
