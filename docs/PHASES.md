# Shastra – Development Phases

## Phase 1 — Foundation ✅ CURRENT

**Goal:** Working homepage + API skeleton that proves frontend ↔ backend connectivity.

Deliverables:
- Vivekananda-themed homepage with Om symbol animation
- Five-metric feature cards rendered from config
- Express API with `/api/health` endpoint
- CORS, body-parser, global error handler
- `.env` configuration pattern

---

## Phase 2 — Authentication 🔜

**Goal:** Users can register and log in.

Deliverables:
- Login and registration pages (HTML/CSS)
- `POST /api/auth/register` – hash password with bcrypt, store user in MongoDB
- `POST /api/auth/login` – validate credentials, return JWT
- JWT middleware to protect future routes
- Redirect to student dashboard after login

---

## Phase 3 — Student Dashboard + Metrics

**Goal:** Students see their metric scores and daily progress.

Deliverables:
- Student dashboard page with five metric gauges
- MongoDB schemas: `User`, `MetricSnapshot`
- `GET /api/metrics/:userId` – fetch metric history
- `POST /api/metrics` – record a new snapshot
- Animated progress charts (CSS or Chart.js)

---

## Phase 4 — Tasks + Real Data

**Goal:** Students receive tasks and their completions feed the metric calculations.

Deliverables:
- Task list page (assigned tasks, due dates, status)
- `GET /api/tasks` – list tasks for a student
- `POST /api/tasks/:id/submit` – submit a solution
- Algorithm to derive metric scores from task history

---

## Phase 5 — Teacher Dashboard + Leaderboard

**Goal:** Teachers can see class-level analytics and assign tasks.

Deliverables:
- Teacher dashboard with class overview
- Leaderboard ranked by combined metric score
- `POST /api/tasks` – teacher creates a task
- `GET /api/teachers/class/:classId` – class analytics endpoint

---

## Phase 6 — Production Deployment

**Goal:** The platform runs on a publicly accessible URL.

Deliverables:
- Dockerise backend
- Deploy API to Railway / Render / Fly.io
- Deploy frontend to Vercel / Netlify / GitHub Pages
- Set production environment variables
- Add basic rate-limiting and helmet security headers
