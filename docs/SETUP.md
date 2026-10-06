# Shastra – Local Development Setup

Step-by-step guide to run the platform on your machine.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 LTS |
| npm | ≥ 9 |
| Git | any |

---

## Steps

### 1. Clone the repository

```bash
git clone https://github.com/rishibhaskar777/shastra-project.git
cd shastra-project
```

### 2. Start the backend (port 5000)

```bash
cd backend
npm install
cp .env.example .env
# Optional: open .env and customise PORT, FRONTEND_URL, etc.
npm run dev
```

You should see:
```
🚀 Shastra API running on http://localhost:5000
```

Verify it works:
```bash
curl http://localhost:5000/api/health
# {"status":"OK","message":"Shastra API running", ...}
```

### 3. Start the frontend (port 3000)

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

You should see:
```
Starting up http-server, serving .
Available on: http://localhost:3000
```

### 4. Open in browser

Navigate to **http://localhost:3000**.

The hero section should load with the Vivekananda portrait and show the
**"API Connected"** badge once the backend health check responds.

---

## Common issues

| Symptom | Fix |
|---|---|
| `EADDRINUSE 5000` | Another process is using port 5000. Change `PORT` in `.env`. |
| API badge shows "Offline" | Make sure the backend is running and CORS origin matches your frontend port. |
| `command not found: nodemon` | Run `npm install` inside `backend/` — nodemon is a devDependency. |
| Fonts not loading | You need internet access for Google Fonts. Use a local fallback offline. |
