# 🥷 CyberNinja – Multilingual Cybersecurity Training Platform

> Final Year Project | Full-Stack MERN Application

---

## 📋 PROJECT OVERVIEW

CyberNinja is a comprehensive cybersecurity awareness and training platform featuring:
- **Swipe-based quiz system** (Tinder-style UX)
- **10 cybersecurity categories** with 3 difficulty levels
- **Interactive simulations** (phishing, scam calls)
- **Phishing URL detector**
- **Multilingual**: English, Hindi, Marathi
- **Admin panel** with full CRUD
- **Leaderboard** with badges
- **Dark cyberpunk UI** with Framer Motion animations

---

## 🛠️ TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT (30-day expiry) |
| Charts | Recharts |
| Swipe | react-swipeable |

---

## ⚡ QUICK SETUP (Step by Step)

### STEP 1 – Prerequisites

Make sure you have installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  - OR use **MongoDB Atlas** (free cloud) → https://www.mongodb.com/atlas
- **VS Code** → https://code.visualstudio.com
- **Git** (optional)

### STEP 2 – Open Project in VS Code

```
File → Open Folder → Select the "cyberninja" folder
```

### STEP 3 – Open TWO Terminals in VS Code

Press `` Ctrl+` `` to open terminal.
Click the **+** icon to open a second terminal.

---

### STEP 4 – Setup Backend

In **Terminal 1**:

```bash
cd backend
npm install
```

Create `.env` file (already created, but verify):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cyberninja
JWT_SECRET=cyberninja_super_secret_key_2024_change_in_production
NODE_ENV=development
```

> 💡 If using MongoDB Atlas, replace MONGODB_URI with your Atlas connection string

### STEP 5 – Seed the Database

Still in Terminal 1 (backend folder):

```bash
npm run seed
```

Expected output:
```
✅ MongoDB connected
✅ Seeded: 15 questions, 5 articles, 2 simulations
👤 Admin: admin@cyberninja.com / Admin@123
👤 Demo:  demo@cyberninja.com / Demo@123
```

### STEP 6 – Start Backend Server

```bash
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

### STEP 7 – Setup Frontend

In **Terminal 2**:

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### STEP 8 – Open in Browser

Navigate to: **http://localhost:5173**

**Demo Login Credentials:**
| Role | Email | Password |
|------|-------|----------|
| User | demo@cyberninja.com | Demo@123 |
| Admin | admin@cyberninja.com | Admin@123 |

---

## 📁 PROJECT STRUCTURE

```
cyberninja/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Login, Register, Profile
│   │   ├── quizController.js       # Quiz submit, history, feedback
│   │   ├── phishingController.js   # URL analysis engine
│   │   ├── leaderboardController.js
│   │   └── adminController.js      # Admin CRUD operations
│   ├── models/
│   │   ├── User.js                 # User schema with stats
│   │   ├── Question.js             # Multilingual questions
│   │   ├── Article.js              # Learning articles
│   │   ├── Simulation.js           # Attack simulations
│   │   └── QuizResult.js           # Quiz history
│   ├── middleware/
│   │   └── auth.js                 # JWT + Admin middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── quiz.js
│   │   ├── articles.js
│   │   ├── simulations.js
│   │   ├── leaderboard.js
│   │   ├── admin.js
│   │   └── phishing.js
│   ├── seed.js                     # Database seeder
│   ├── server.js                   # Express entry point
│   └── .env                        # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Layout.jsx      # Sidebar + main layout
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state + API client
│   │   │   └── LanguageContext.jsx # i18n translations
│   │   ├── locales/
│   │   │   ├── en.json             # English translations
│   │   │   ├── hi.json             # Hindi translations
│   │   │   └── mr.json             # Marathi translations
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Home / hero page
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx   # Stats, charts, weak areas
│   │   │   ├── QuizPage.jsx        # Swipe quiz system
│   │   │   ├── LearnPage.jsx       # Articles list
│   │   │   ├── ArticlePage.jsx     # Article detail
│   │   │   ├── SimulationPage.jsx  # Interactive simulations
│   │   │   ├── PhishingDetectorPage.jsx
│   │   │   ├── LeaderboardPage.jsx
│   │   │   └── AdminPage.jsx       # Admin panel
│   │   ├── App.jsx                 # Routes + providers
│   │   ├── main.jsx
│   │   └── index.css               # Cyber theme CSS
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🌐 API ENDPOINTS

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Quiz
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/questions?category=&level=&limit= | Get questions |
| POST | /api/quiz/submit | Submit quiz answers |
| GET | /api/quiz/history | User quiz history |

### Content
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/articles | All articles |
| GET | /api/articles/:id | Single article |
| GET | /api/simulations | All simulations |
| POST | /api/phishing/analyze | Analyze URL |
| GET | /api/leaderboard | Top users |

### Admin (Admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/admin/stats | Platform stats |
| GET/POST | /api/admin/questions | Manage questions |
| DELETE | /api/admin/questions/:id | Delete question |
| GET/POST | /api/admin/articles | Manage articles |
| GET | /api/admin/users | All users |

---

## 🎮 FEATURES GUIDE

### Swipe Quiz
- Navigate to **Quiz** page
- Select category + difficulty
- **Swipe RIGHT** = Choose correct answer
- **Swipe LEFT** = Skip / wrong answer
- **Tap any option** for normal selection
- See explanation after each question
- Get personalized feedback + score

### Phishing Detector
- Enter any URL
- Click ANALYZE
- See: Risk Score (0-100), Warnings, Safe indicators
- Use example URLs to test

### Simulations
- Choose a simulation (Phishing email, UPI fraud call)
- Step through real scenarios
- Make choices and see consequences
- Learn the correct approach

### Admin Panel
- Login with admin credentials
- View platform statistics
- Add/Delete questions with multilingual support
- Manage articles and view users

---

## 🔒 SECURITY FEATURES

- JWT tokens with 30-day expiry
- Password hashing with bcrypt (12 rounds)
- Protected routes (middleware)
- Role-based access control (User/Admin)
- Input validation on all endpoints

---

## 🌐 MULTILINGUAL USAGE

Change language using the sidebar buttons (EN / HI / MR):
- All UI text changes dynamically
- Quiz questions show in selected language
- Articles show in selected language
- Language preference saved to localStorage

---

## 🐛 TROUBLESHOOTING

**MongoDB not connecting?**
- Make sure MongoDB service is running
- Windows: `net start MongoDB`
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

**Port 5000 already in use?**
- Change PORT in backend/.env to 5001
- Update frontend/vite.config.js proxy target accordingly

**npm install fails?**
- Run: `npm install --legacy-peer-deps`
- Or update Node.js to v18+

**Questions not loading?**
- Run seed again: `cd backend && npm run seed`
- Check MongoDB connection in terminal

---

## 🎓 PROJECT CREDITS

Built as Final Year Project
- Platform: CyberNinja
- Stack: MERN (MongoDB, Express, React, Node.js)
- Auth: JWT
- Styling: Tailwind CSS + Custom Cyber Theme
- Animations: Framer Motion

---

## 📞 SUPPORT

For issues, check:
1. MongoDB is running
2. Both terminals are active (backend on :5000, frontend on :5173)
3. .env file exists in backend folder
4. Seed data was added successfully
