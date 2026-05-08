const PolicyType = require('../models/PolicyType');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedDB = async () => {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    await User.create({
      fullName: 'Admin TakafulGo',
      email: 'admin@takafulgo.pk',
      password: 'Admin1234!',
      cnic: '42101-1234567-1',
      phone: '03001234567',
      role: 'admin',
      isVerified: true
    });
    console.log('[Seed] Admin user created: admin@takafulgo.pk / Admin1234!');
  }

  const existing = await PolicyType.countDocuments();
  if (existing > 0) return;

  await PolicyType.insertMany([
    {
      slug: 'rain-wedding',
      name: 'Rain on Wedding Day',
      description: 'Protect your outdoor wedding from rainfall disruption. Automatic payout triggered when rainfall exceeds 5mm at your event location on the event date.',
      triggerCondition: 'Rainfall ≥ 5mm at event location on event date, verified via OpenWeatherMap API',
      coverageTiers: [
        { label: 'Basic', premium: 500, payoutAmount: 10000, durationDays: 1 },
        { label: 'Standard', premium: 1000, payoutAmount: 25000, durationDays: 1 },
        { label: 'Premium', premium: 2000, payoutAmount: 50000, durationDays: 1 }
      ]
    },
    {
      slug: 'dengue-hospitalization',
      name: 'Dengue Hospitalization',
      description: 'Short-term dengue fever hospitalization coverage for seasonal protection. Fixed-duration policy with automatic payout on confirmed hospital admission.',
      triggerCondition: 'Confirmed hospital admission for dengue fever with medical records',
      coverageTiers: [
        { label: '1 Month', premium: 350, payoutAmount: 20000, durationDays: 30 },
        { label: '2 Months', premium: 600, payoutAmount: 40000, durationDays: 60 },
        { label: '3 Months', premium: 850, payoutAmount: 60000, durationDays: 90 }
      ]
    },
    {
      slug: 'screen-damage',
      name: 'Mobile Screen Damage',
      description: 'Temporary screen damage protection for your smartphone. Get covered for repair costs on screen damage within the policy period.',
      triggerCondition: 'Confirmed screen damage with repair invoice from authorized service center',
      coverageTiers: [
        { label: '1 Month', premium: 200, payoutAmount: 8000, durationDays: 30 },
        { label: '3 Months', premium: 500, payoutAmount: 15000, durationDays: 90 },
        { label: '6 Months', premium: 900, payoutAmount: 20000, durationDays: 180 }
      ]
    }
  ]);

  console.log('[Seed] Policy types seeded successfully.');
};

module.exports = seedDB;
