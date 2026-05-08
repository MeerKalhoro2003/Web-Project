require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const claimsJob = require('./utils/claimsJob');
const seedDB = require('./utils/seed');

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedDB();
  app.listen(PORT, () => {
    console.log(`TakafulGo server running on port ${PORT}`);
    claimsJob.start();
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err.message);
  process.exit(1);
});
