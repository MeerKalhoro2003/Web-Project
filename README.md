# TakafulGo

A parametric micro-insurance platform built for Pakistan, offering short-term, event-based insurance policies with automatic claim triggering. Users can purchase policies, file claims, and receive payouts — all without traditional paperwork.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Security | Helmet, CORS, express-rate-limit |

---

## Features

- **User authentication** — Register with OTP verification, login, profile management
- **Three policy types** — Rain on Wedding Day, Dengue Hospitalization, Mobile Screen Damage
- **Tiered coverage** — Each policy has multiple coverage tiers (Basic / Standard / Premium)
- **Claim submission** — Submit and track claim status
- **Fraud detection** — Automated fraud flagging on suspicious claims
- **Notifications** — In-app notification system
- **Partner portal** — Partners can register and view their dashboard
- **Admin panel** — Manage users, policies, claims, partners, fraud flags, and policy types
- **Reports** — User dashboard with charts (revenue, claims, policy distribution)
- **Scheduled jobs** — Cron job for automated claims processing

---

## Project Structure

```
takafulgo/
├── backend/
│   ├── app.js              # Express app setup, middleware, routes
│   ├── server.js           # Entry point, DB connection, cron start
│   ├── config/
│   │   └── db.js
│   ├── controllers/        # Route handlers
│   ├── middlewares/        # Auth, validation, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   └── utils/              # Seed, fraud detection, cron job
└── frontend/
    ├── src/
    │   ├── api/index.js    # Axios instance
    │   ├── components/     # Shared components & charts
    │   ├── context/        # Auth context
    │   └── pages/          # All page components
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repository

```bash
git clone git@github.com:MeerKalhoro2003/Web-Project.git
cd Web-Project
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/takafulgo
JWT_SECRET=your_jwt_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and expects the backend at `http://localhost:5000/api`.

> Make sure the `baseURL` in `frontend/src/api/index.js` matches your backend port.

---

## Default Admin Account

Seeded automatically on first run:

| Field | Value |
|-------|-------|
| Email | `admin@takafulgo.pk` |
| Password | `Admin1234!` |

---

## Policy Types

| Policy | Trigger | Duration |
|--------|---------|----------|
| Rain on Wedding Day | Rainfall ≥ 5mm at event location | 1 day |
| Dengue Hospitalization | Confirmed hospital admission for dengue | 30 / 60 / 90 days |
| Mobile Screen Damage | Screen damage with repair invoice | 30 / 90 / 180 days |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register new user |
| POST | `/auth/verify-otp` | — | Verify OTP |
| POST | `/auth/login` | — | Login |
| GET | `/auth/me` | ✓ | Get current user |
| PUT | `/auth/profile` | ✓ | Update profile |
| PUT | `/auth/change-password` | ✓ | Change password |
| POST | `/auth/logout` | ✓ | Logout |
| GET | `/policies/types` | — | List policy types |
| POST | `/policies/purchase` | ✓ | Purchase a policy |
| GET | `/policies/my` | ✓ | My policies |
| GET | `/policies/:id` | ✓ | Policy details |
| POST | `/claims/check/:policyId` | ✓ | Submit a claim |
| GET | `/claims/status/:claimId` | ✓ | Claim status |
| GET | `/notifications` | ✓ | Get notifications |
| PUT | `/notifications/:id/read` | ✓ | Mark as read |
| POST | `/partners/register` | ✓ | Register as partner |
| GET | `/partners/dashboard` | ✓ | Partner dashboard |
| GET | `/reports/user-dashboard` | ✓ | User report data |
| GET | `/admin/dashboard` | admin | Admin stats |
| GET | `/admin/users` | admin | All users |
| PATCH | `/admin/users/:id/block` | admin | Block a user |
| GET | `/admin/policies` | admin | All policies |
| GET | `/admin/claims` | admin | All claims |
| GET | `/admin/policy-types` | admin | Policy types |
| PUT | `/admin/policy-types/:id` | admin | Update policy type |
| GET | `/admin/partners` | admin | All partners |
| GET | `/fraud-flags` | admin | Fraud flags |
| GET | `/health` | — | Health check |

---

## Frontend Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/dashboard` | user, partner | User dashboard |
| `/purchase` | user | Buy a policy |
| `/profile` | authenticated | Profile settings |
| `/notifications` | authenticated | Notifications |
| `/admin/dashboard` | admin | Admin dashboard |
| `/admin/users` | admin | User management |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `FRONTEND_URL` | Frontend origin for CORS |
| `CLIENT_URL` | Alias for frontend origin |
| `NODE_ENV` | `development` or `production` |
