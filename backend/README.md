# Attendance Backend

Simple Express + MongoDB backend for Attendance Management.

Steps:

1. copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. cd backend
3. npm install
4. npm run dev

Endpoints (summary):
- `POST /api/auth/signup` - create manager
- `POST /api/auth/login` - login
- `GET /api/members` - list members (auth)
- `POST /api/members` - add member (manager)
- `POST /api/meetings` - create meeting (manager)
- `GET /api/meetings` - list meetings (auth)
- `PUT /api/meetings/:id/attendance` - mark attendance (manager)
- `GET /api/meetings/stats/summary` - dashboard stats (manager)
