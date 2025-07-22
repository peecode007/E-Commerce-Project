
# UrbanAura - Modern E-commerce Platform

A full-stack e-commerce platform built with React, Node.js, and MongoDB featuring modern UI/UX design with glassmorphism effects.

## Features

### Customer Features
- User authentication with Firebase
- Product browsing with advanced filtering
- Search functionality with real-time results
- Shopping cart management
- Order tracking and history
- Responsive design for all devices
- Modern glassmorphism UI

### Admin Features
- Admin dashboard with analytics
- Product management (CRUD operations)
- Category management
- Order management
- User management
- Role-based access control

### Technical Features
- Pagination for efficient data loading
- Advanced sorting and filtering
- Grid/List view toggle
- Protected routes
- Real-time search
- Error handling and loading states

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- React Icons
- Axios
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Firebase Admin SDK
- JWT Authentication

### ⚙️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd ecommerce-project
````

2. **Install dependencies**

```bash
# Install root tools (concurrently)
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

## ⚙️ Environment Variables

### 🧪 Server: `server/.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key (escaped with \\n)
```


---

## 🧭 Running the Project

You can run the entire project from the root using:

```bash
npm run dev
```

This will:

* Start the React frontend on [http://localhost:5173](http://localhost:5173)
* Start the Express server on [http://localhost:3000](http://localhost:3000)

---

## 🔄 Available Scripts

### Root (`package.json`)

```bash
npm run dev       # Runs both frontend and backend together
npm run client    # Runs the Vite frontend only
npm run server    # Runs the backend (with nodemon)
```

---

## Environment Setup

### Backend Environment (.env in server folder)
```


# Database

MONGODB_URI=mongodb://localhost:27017/urbanaura

# Firebase Admin SDK

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Server Configuration

PORT=3000
NODE_ENV=development

```

### Frontend Firebase Configuration
Create `src/firebase/config.js`:
```

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


### Admin Access
Add admin emails to the `adminEmails` array in `client/src/App.js`:
```

const adminEmails = [
'admin@example.com',
'your-admin-email@gmail.com'
];

```

## Project Structure

```

urbanaura/
├── client/                    \# React Frontend
│   ├── public/
│   │   ├── logo.svg
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── firebase/
│   │   │   └── config.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                    \# Node.js Backend
│   ├── controllers/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   └── categoryModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── categoryRoutes.js
│   ├── config/
│   │   └── database.js
│   ├── server.js
│   └── package.json
└── README.md

```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get products with pagination
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

## Key Features Implementation

### Product Filtering & Search
- Category-based filtering
- Price range filtering
- Brand filtering
- Text search with real-time results
- Sorting by price, name, date

### Pagination
- Server-side pagination
- URL-based page state
- Smooth page transitions
- Auto-scroll to top on page change

### Authentication Flow
- Firebase Authentication
- JWT token validation
- Role-based access control
- Protected routes for admin and users

### UI/UX Features
- Glassmorphism design
- Violet/Indigo gradient theme
- Responsive grid and list views
- Smooth animations and transitions
- Modern card layouts with hover effects

## Deployment

### Frontend (Netlify/Vercel)
```

cd client
npm run build

# Deploy the build folder

```

### Backend (Railway/Heroku)
```

cd server

# Set environment variables on platform

# Deploy to chosen platform

```

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update MONGODB_URI in environment variables
3. Configure network access and database users

