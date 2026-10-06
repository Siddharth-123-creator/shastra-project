# Shastra – Awakening Education Platform

> *"Arise, awake, and stop not till the goal is reached."* — Swami Vivekananda

Shastra is a Vivekananda-themed student education platform that goes beyond grades.
It measures the five inner qualities that determine long-term success.

---

## The Five Core Metrics

| Metric | Description |
|---|---|
| 🧘 **Concentration** | Sustained focus and deep attention |
| 💪 **Self-Reliance** | Independence and inner strength |
| 🧗 **Perseverance** | Steady climb through challenges |
| ⭐ **Confidence** | Belief in your own potential |
| ❤️ **Character** | Virtue, integrity, and values |

---

## Tech Stack

- **Frontend** – Plain HTML + CSS + JavaScript (no framework)
- **Backend** – Node.js / Express
- **Database** – MongoDB via Mongoose *(Phase 3)*
- **Styling** – Playfair Display + Hind (Google Fonts), CSS custom properties

---

## Quick Start (local)

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1 — Backend

```bash
cd backend
npm install
cp .env.example .env   # edit PORT, MONGO_URI, etc.
npm run dev            # http://localhost:5000
```

### 2 — Frontend

```bash
cd frontend
npm install
npm start              # http://localhost:3000
```

Open **http://localhost:3000** in your browser.
The hero badge should show **API Connected** once the backend is running.

---

## Project Status

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Done | Homepage + API foundation |
| Phase 2 | 🔜 Next | Login page + authentication |
| Phase 3 | — | Student dashboard + metrics |
| Phase 4 | — | Task solving + real data |
| Phase 5 | — | Teacher dashboard + leaderboards |
| Phase 6 | — | Production deployment |

---

## Team

Built for the hackathon by **rishibhaskar777** and contributors.

---

## License

[MIT](LICENSE)
