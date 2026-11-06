# 🎓 Smart Course & Timetable Management System

A full-stack academic course scheduling and timetable management application built with the MERN stack (MongoDB, Express, React, Node.js). Designed to eliminate classroom and instructor scheduling conflicts with automated overlap detection and granular Role-Based Access Control (RBAC).

---

## ✨ Features

- **Conflict Detection Engine:** Validates time slot availability on write to prevent overlapping classroom reservations and instructor double-booking.
- **Role-Based Access Control (RBAC):** Distinct permission layers and personalized views for **Administrators**, **Teachers**, and **Students**.
- **Interactive Dashboards:** Real-time metrics tracking total courses, active teachers, and enrolled students.
- **Timetable Management:** Dynamic weekly schedule view supporting full CRUD operations for courses, faculty assignments, and rooms.
- **Secure Authentication:** User authentication powered by JSON Web Tokens (JWT) and `bcryptjs` password hashing.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router, Context API
- **Backend:** Node.js, Express.js, JWT, bcryptjs, CORS
- **Database:** MongoDB with Mongoose ODM

---

## 📁 Project Structure

```text
course-scheduler/
├── backend/
│   ├── config/         # Database and server configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth and RBAC middleware
│   ├── models/         # Mongoose schemas (User, Course, Timetable)
│   ├── routes/         # Express API routes
│   └── server.js       # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── api/        # Axios API client setup
│   │   ├── components/ # Reusable UI components (Navbar, ProtectedRoute)
│   │   ├── context/    # Global AuthContext
│   │   └── pages/      # Dashboards, Login, Register, Timetable
│   └── package.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 1. Clone the repository

```bash
git clone https://github.com/urghpiyushhhhh/course-scheduler.git
cd course-scheduler
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/courseSchedulerDB
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔒 API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | Public |
| `GET` | `/api/timetable` | Fetch all timetable entries | Authenticated |
| `POST` | `/api/timetable` | Add timetable entry (with conflict check) | Admin only |
| `DELETE` | `/api/timetable/:id` | Remove timetable entry | Admin only |
| `GET` | `/api/courses` | List all available courses | Authenticated |
| `POST` | `/api/courses` | Create a new course | Admin only |
| `GET` | `/api/users/teachers` | Fetch list of teachers | Admin only |

---

## 📄 License

This project is licensed under the MIT License.
