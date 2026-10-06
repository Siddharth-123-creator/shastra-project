# Shastra – Architecture Overview

## High-level diagram

```
Browser (port 3000)
    │
    │  HTTP fetch("/api/...")
    ▼
Express API (port 5000)
    │
    ├── /api/health   → health.js route
    ├── /api/auth/*   → auth.js route  (Phase 2)
    ├── /api/metrics  → metrics.js     (Phase 3)
    ├── /api/tasks    → tasks.js       (Phase 4)
    └── /api/teachers → teachers.js    (Phase 5)
         │
         ▼
    MongoDB (mongoose)                 (Phase 3)
```

## Frontend → Backend communication

The frontend (`frontend/`) is a static HTML/CSS/JS site served by `http-server`
on port 3000.  It makes **fetch()** calls to the Express API on port 5000.

All API base-URL configuration lives in `frontend/js/config.js` under
`SHASTRA_CONFIG.API_BASE_URL`.  Change this one value for staging / production.

CORS is configured in `backend/server.js` and allows requests from
`FRONTEND_URL` (defaults to `http://localhost:3000`).

## Backend structure

```
backend/
├── server.js          Express app + startup
├── config/
│   └── database.js    MongoDB connection factory (Phase 3)
├── routes/
│   ├── health.js      GET /api/health
│   └── auth.js        POST /api/auth/login|register (Phase 2)
└── middleware/
    └── errorHandler.js  Global JSON error responses
```

## API endpoints (Phase 1)

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check – returns `{status:"OK"}` |
| POST | `/api/auth/register` | *(Phase 2 stub)* |
| POST | `/api/auth/login` | *(Phase 2 stub)* |

## Database (Phase 3 preview)

MongoDB via Mongoose.  Planned collections:

| Collection | Purpose |
|---|---|
| `users` | Students and teachers |
| `metrics` | Daily metric snapshots per user |
| `tasks` | Tasks assigned to students |
| `submissions` | Student task submissions |
