# 🌆 **UrbanAura - Modern E-commerce Platform**

A sleek, full-stack e-commerce application built using **React**, **Node.js**, and **MongoDB**, designed with **glassmorphism UI** and responsive features.

---

## 🚀 Features

### 🛍️ Customer

* 🔐 Firebase authentication
* 🔎 Product browsing with real-time search
* 🛒 Shopping cart with checkout flow
* 🧾 Order tracking and history
* 📱 Fully responsive layout
* 🧊 Modern glassmorphism UI

### 🛠️ Admin

* 📊 Admin dashboard with analytics
* 🗃️ Product/category management
* 📦 Order and user control
* 👥 Role-based access control (RBAC)

### ⚙️ Technical

* 📄 Pagination, filtering, and sorting
* 🧭 Grid/List view toggles
* 🔐 Protected routes
* ⚠️ Error boundaries and loading states

---

## 🧰 Tech Stack

### 🔧 Frontend

* `React 18`, `React Router DOM`
* `Tailwind CSS`, `React Icons`
* `Axios`, `Firebase Auth`

### 🔩 Backend

* `Node.js`, `Express.js`
* `MongoDB + Mongoose`
* `Firebase Admin SDK`
* `JWT Authentication`

---

## 📦 Installation Guide

### 1. **Clone the Repository**

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd ecommerce-project
```

### 2. **Install Dependencies**

```bash
npm install         # Root
cd client && npm install     # Frontend
cd ../server && npm install  # Backend
```

---

## 🔐 Environment Variables

### 📁 Backend: `server/.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key (escaped with \\n)
```

### 🌐 Frontend: `src/firebase/config.js`

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

---

## 🧭 Running the Project

```bash
npm run dev
```

* 🖥️ Frontend: [http://localhost:5173](http://localhost:5173)
* 🔌 Backend: [http://localhost:3000](http://localhost:3000)

### 🛠️ Available Scripts

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `npm run dev`    | Start both frontend and backend  |
| `npm run client` | Start only the frontend          |
| `npm run server` | Start only the backend (nodemon) |

---

## 👤 Admin Access

Add admin emails to `client/src/App.js`:

```js
const adminEmails = [
  'admin@example.com',
  'your-admin-email@gmail.com'
];
```

---

## 📂 Project Structure

```
urbanaura/
├── client/       # React frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── firebase/
│       ├── pages/
│       ├── App.js
│       └── index.js
├── server/       # Node backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
└── README.md
```

---

## 🌐 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/profile`

### Products

* `GET /api/products`
* `GET /api/products/:id`
* `POST`, `PUT`, `DELETE` (Admin only)

### Categories

* `GET /api/categories`
* `POST`, `PUT`, `DELETE` (Admin only)

---

## 🔍 Feature Highlights

### 🧠 Filtering & Search

* 📂 Category, 💰 Price, 🔤 Brand filters
* ⏱️ Real-time search
* 🔃 Sort by name, price, or date

### 📑 Pagination

* Server-side
* URL-based
* Auto-scroll to top

### 🔐 Authentication

* Firebase login
* JWT-based authorization
* RBAC with admin-only routes

### 🎨 UI/UX

* Glassmorphism aesthetics
* Indigo/Violet gradients
* Card components, smooth transitions

---

## 🚀 Deployment

### Frontend

```bash
cd client
npm run build
# Deploy /client/dist to Vercel/Netlify
```

### Backend

```bash
cd server
# Deploy to Railway/Heroku and add .env vars
```

### MongoDB

* Setup [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* Whitelist IP, add DB user, update `.env`

---

