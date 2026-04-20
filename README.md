# FreshDish Restaurant Ordering System

FreshDish is a full-stack restaurant ordering platform built with the MERN stack. It allows customers to browse a rich menu, add items to their cart, get smart suggestions, and place orders for pickup or delivery. Admins and kitchen staff can manage orders and menu items through dedicated dashboards.


## Agile Workflow

This project was managed using Agile practices with GitHub Projects. Work was broken down into small, manageable tasks and tracked on an Agile board with columns for Backlog, To Do, In Progress, Review/Testing, and Done. Tasks were moved through these workflow stages as development progressed, and sprints were used to organize and prioritize work. This approach helped ensure continuous progress, adaptability, and clear visibility into the project’s status.

## Features

- **User Registration & Login:** Secure authentication for customers, admins, and kitchen staff.
- **Menu Browsing:** Filter dishes by Vegetarian, Non-Vegetarian, Drinks & Beverages, and Desserts.
- **Smart Suggestions:** See popular dishes and chef-recommended combos in a sidebar.
- **Cart & Checkout:** Add items to cart, adjust quantities, and checkout with a summary.
- **Order Tracking:** Track your order status in real time.
- **Admin Dashboard:** Manage menu items, mark dishes as popular, and view all orders.
- **Kitchen Dashboard:** View and update order statuses.
- **JWT Authentication:** Secure protected routes for users and admins.
- **Responsive UI:** Modern, mobile-friendly design using React and Vite.

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd FreshDish
   ```
2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```
4. **Configure environment variables:**
   - Copy `backend/.env.example` to `backend/.env` and set your `MONGO_URI` and any secrets.

5. **Seed the database with sample data:**
   ```bash
   cd ../backend
   node data/seed.js
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

7. **Start the frontend app:**
   ```bash
   cd ../client
   npm run dev
   ```

8. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

## Default Users
- **Admin:**
  - Email: `admin@freshdish.com`
  - Password: `Admin@1234`
- **Kitchen Staff:**
  - Email: `kitchen@freshdish.com`
  - Password: `Kitchen@1234`
- **Customer:**
  - Email: `olu@gmail.com`
  - Password: `Customer@1234`


## Project Structure
```
FreshDish/
├── backend/
│   ├── config/         # DB config
│   ├── data/           # Seed scripts
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── tests/          # Jest test files
│   └── ...
├── client/
│   ├── public/
│   │   └── assets/
│   └── src/
│       ├── components/  # React components & tests
│       ├── pages/       # React pages
│       ├── utils.js     # Utility functions
│       ├── utils.test.js# Utility tests
│       └── ...
└── README.md
```

## Environment Variables

### Backend (`backend/.env`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT tokens
- (Add any other secrets your app uses)

### Frontend (`client/.env`)
- (Add any API base URLs or public keys if needed)

## Useful Scripts

### Backend
- `npm run dev` — Start backend with nodemon
- `npm run seed` — Seed the database
- `npm test` — Run backend tests

### Frontend
- `npm run dev` — Start frontend (Vite)
- `npm run build` — Build frontend for production
- `npm test` — Run frontend tests

## API Endpoints (Examples)

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/menu` — Get menu items
- `POST /api/orders` — Place an order
- `GET /api/orders/:id` — Get order status

> See `backend/routes/` for full API details.

## Usage & Screenshots

> Add screenshots or GIFs here to show the UI and features in action!

## Troubleshooting

- **Jest image import errors:** Make sure `jest.config.js` includes `moduleNameMapper` for images and you have a `src/__mocks__/fileMock.js` file.
- **React Router warnings in tests:** These are suppressed in test files for clean output.
- **MongoDB connection errors in tests:** Backend tests use in-memory MongoDB, so no local DB is needed.
- **Test failures:** Ensure all exports/imports match and mock data matches component/model requirements.

## Deployment

- Backend deployed to Render: https://freshdish.onrender.com
- Frontend deployed to Vercel: https://fresh-dish.vercel.app/menu
- MongoDB Atlas used for cloud database.

## Live Demo

- Backend API: https://freshdish.onrender.com/api
- Frontend App: https://fresh-dish.vercel.app/menu

## License

## Testing

### Backend (Node.js/Express)
- **Test Runner:** Jest
- **Test Location:** `backend/tests/`
- **How to Run:**
   ```bash
   cd backend
   npm test
   ```
- **Features:**
   - Uses `mongodb-memory-server` for fast, isolated model tests (no need for a running MongoDB).
   - Includes tests for models, routes, and utility functions.
   - Example: `userModel.test.js`, `menuRoute.test.js`, `utils.test.js`

### Frontend (React/Vite)
- **Test Runner:** Jest + React Testing Library
- **Test Location:** `client/src/components/*.test.jsx`, `client/src/utils.test.js`
- **How to Run:**
   ```bash
   cd client
   npm test
   ```
- **Features:**
   - Tests React components and utility functions.
   - Mocks static assets (images) for smooth testing.
   - Example: `MenuCard.test.jsx`, `NavBar.test.jsx`, `utils.test.js`
   - Suppresses React Router warnings for clean output.

### Best Practices
- Run all tests before pushing or deploying.
- Add tests for new features and bug fixes.
- Use mock data and in-memory databases for safe, fast tests.

MIT

## Deployment Guide

1. Provision a MongoDB Atlas cluster or cloud database.
2. Update `MONGO_URI` in `backend/.env` with the cloud connection string.
3. Deploy the backend to a cloud provider like Heroku, Render, or Vercel Serverless.
4. Deploy the frontend to Vercel, Netlify, or Cloudflare Pages.
5. Point the frontend API base URL to the deployed backend.
6. Migrate sample data using the backend seed scripts or direct database import.

## Notes

- Use secure credentials and store secrets safely.
- For production, enable HTTPS and set `NODE_ENV=production`.
