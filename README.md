# 🚗 DriveWay — Car Rental Booking System

A production-ready full-stack car rental platform built with React, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
car-rental/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, getMe
│   │   ├── carController.js       # CRUD for cars
│   │   └── bookingController.js   # Booking logic + overlap detection
│   │   └── ChatController.js   
│   ├── middleware/
│   │   ├── auth.js                # protect + restrictTo(role)
│   │   ├── errorHandler.js        # Global error handler + notFound
│   │   └── validate.js            # express-validator middleware
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt hash)
│   │   ├── Car.js                 # Car schema
│   │   └── Booking.js             # Booking schema (overlap index)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   └── bookingRoutes.js
│   │   └── chatRoutes.js
│   ├── utils/
│   │   ├── generateToken.js       # JWT token generator
│   │   ├── emailService.js
│   │   └── seed.js                # Database seeder
│   ├── server.js                  # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   └── Spinner.jsx
    │   │   │   └── Chatbot.jsx
    │   │   └── car/
    │   │       └── CarCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # JWT auth state + localStorage sync
    │   ├── hooks/
    │   │   └── useApi.js          # Generic async hook
    │   ├── layouts/
    │   │   └── MainLayout.jsx     # Navbar + footer wrapper
    │   ├── pages/
    │   │   ├── HomePage.jsx       # Car listing + filters
    │   │   ├── CarDetailPage.jsx  # Single car view
    │   │   ├── BookingPage.jsx    # Date selection + price calc
    │   │   ├── MyBookingsPage.jsx # User booking history
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── AdminDashboard.jsx # Stats + bookings + car CRUD
    │   │   └── VerifyEmailPage.jsx
    │   ├── services/
    │   │   ├── api.js             # Axios instance + interceptors
    │   │   ├── authService.js
    │   │   ├── carService.js
    │   │   └── bookingService.js
    │   ├── App.jsx                # Router config + protected routes
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
    └── package-lock.json
    └── postcss.config.js
    └── postcss.config.js
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install

# Create your .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database with sample data
node utils/seed.js

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create your .env file
cp .env.example .env

# Start development server
npm run dev
```

### 3. Demo Credentials (after seeding)
| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@carrental.com      | admin123  |
| User  | user@carrental.com       | user1234  |

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

**Base URL:** `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

---

### 🔑 Authentication

#### `POST /auth/register`
Register a new user account.

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass"
}
```

**Response `201`:**
```json
{
  "success": true,
  "token": "eyJhbG...",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "user" }
}
```

---

#### `POST /auth/login`
Authenticate and receive a JWT token.

**Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepass"
}
```

**Response `200`:**
```json
{
  "success": true,
  "token": "eyJhbG...",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "user" }
}
```

---

#### `GET /auth/me`
Get the current authenticated user's profile.

**Auth:** Required

**Response `200`:**
```json
{
  "success": true,
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "user" }
}
```

---

### 🚗 Cars

#### `GET /cars`
Get all cars. Supports query params: `?available=true&category=suv`

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "count": 6,
  "cars": [
    {
      "_id": "...",
      "name": "Camry XSE",
      "brand": "Toyota",
      "pricePerDay": 65,
      "image": "https://...",
      "features": ["Bluetooth", "Backup Camera"],
      "available": true,
      "category": "standard",
      "seats": 5,
      "transmission": "automatic"
    }
  ]
}
```

---

#### `GET /cars/:id`
Get a single car by ID.

**Auth:** Public

---

#### `POST /cars`
Create a new car listing.

**Auth:** Admin only

**Body:**
```json
{
  "name": "Model S",
  "brand": "Tesla",
  "pricePerDay": 150,
  "image": "https://...",
  "features": ["Autopilot", "Ludicrous Mode"],
  "category": "luxury",
  "seats": 5,
  "transmission": "automatic",
  "available": true
}
```

---

#### `PUT /cars/:id`
Update a car by ID.

**Auth:** Admin only

---

#### `DELETE /cars/:id`
Delete a car by ID.

**Auth:** Admin only

---

### 📋 Bookings

#### `POST /bookings`
Create a new booking. The server validates dates, checks for overlaps, and calculates total price.

**Auth:** Required

**Body:**
```json
{
  "carId": "64f...",
  "startDate": "2026-03-10",
  "endDate": "2026-03-15",
  "notes": "Please have GPS ready"
}
```

**Response `201`:**
```json
{
  "success": true,
  "booking": {
    "_id": "...",
    "user": { "name": "Jane Doe", "email": "jane@example.com" },
    "car": { "name": "Camry XSE", "brand": "Toyota" },
    "startDate": "2026-03-10T00:00:00.000Z",
    "endDate": "2026-03-15T00:00:00.000Z",
    "totalPrice": 325,
    "status": "pending"
  }
}
```

**Error — Overlapping Booking `409`:**
```json
{
  "success": false,
  "message": "This car is already booked for the selected dates. Please choose different dates."
}
```

---

#### `GET /bookings/my`
Get all bookings for the current authenticated user.

**Auth:** Required

---

#### `GET /bookings`
Get all bookings (admin view).

**Auth:** Admin only

---

#### `GET /bookings/admin/stats`
Get system-wide statistics.

**Auth:** Admin only

**Response `200`:**
```json
{
  "success": true,
  "stats": {
    "totalCars": 6,
    "totalBookings": 24,
    "totalUsers": 15,
    "totalRevenue": 4875,
    "statusBreakdown": [
      { "_id": "confirmed", "count": 12 },
      { "_id": "pending", "count": 5 },
      { "_id": "cancelled", "count": 4 },
      { "_id": "completed", "count": 3 }
    ]
  }
}
```

---

#### `PATCH /bookings/:id/status`
Update a booking's status.

**Auth:** User (cancel own) or Admin (any status)

**Body:**
```json
{ "status": "confirmed" }
```

Valid statuses: `pending`, `confirmed`, `cancelled`, `completed`

---

## 🔒 Booking Overlap Detection Logic

The core conflict detection query in `bookingController.js`:

```javascript
// Two date ranges [A,B] and [C,D] overlap when: A < D AND C < B
// Equivalently, they DON'T overlap when: A >= D OR C >= B

const conflicting = await Booking.findOne({
  car: carId,
  status: { $nin: ['cancelled'] },     // Skip cancelled bookings
  startDate: { $lt: endDate },          // Existing starts before new ends
  endDate:   { $gt: startDate },        // Existing ends after new starts
});
```

This correctly handles all overlap scenarios:
- Complete overlap (new booking entirely within existing)
- Partial overlap on either end
- Existing booking entirely within new booking

---

## 🏗️ Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| JWT in localStorage | Simple for SPA; use HttpOnly cookies for higher security in production |
| `select: false` on password | Passwords are never returned in queries unless explicitly needed |
| Compound index on Booking | `{ car, startDate, endDate }` makes overlap queries O(log n) |
| Global error handler | Single source of truth for all error responses |
| Controller/Route separation | Business logic never lives in route files |
| Axios interceptors | Token injection and 401 handling in one place |

---

## 🚀 Production Deployment Notes

1. **Set `NODE_ENV=production`** — disables Morgan logging and hides stack traces
2. **Use a strong `JWT_SECRET`** — minimum 32 random characters
3. **MongoDB Atlas** — use a production cluster with IP allowlisting
4. **Build frontend:** `npm run build` → serve `dist/` with nginx or Vercel
5. **CORS** — update `CLIENT_URL` to your production frontend domain
6. **Rate limiting** is already configured (100 req/15min per IP)

---

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (cost factor 12)
- ✅ JWT authentication with expiry
- ✅ Role-based access control (user/admin)
- ✅ Input validation with express-validator
- ✅ Rate limiting on all `/api` routes
- ✅ Mongoose schema validation
- ✅ Duplicate key error handling
- ✅ Environment variable secrets (never hardcoded)
