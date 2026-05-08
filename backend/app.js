const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policies');
const claimRoutes = require('./routes/claims');
const adminRoutes = require('./routes/admin');
const partnerRoutes = require('./routes/partners');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/not-found');

const notificationRoutes = require('./routes/notificationRoutes.js');
const fraudRoutes = require('./routes/fraudRoutes.js');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests, please try again later.' } }
});
app.use('/api/', limiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many login attempts.' } }
});
app.use('/api/auth/login', loginLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/fraud-flags', fraudRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TakafulGo API is running' });
});

// Reports Route (Must be before the 404 catch-all)
app.use('/api/reports', require('./routes/reports'));

// 404 Handler for unmatched routes
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
