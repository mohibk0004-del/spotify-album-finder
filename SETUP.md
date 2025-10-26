# 🚀 Quick Setup Guide

## Overview

Your Spotify Album Finder now has a complete authentication system integrated! Here's what's been added:

### ✅ What's New

**Frontend:**
- 🔐 Login & Register modals with beautiful animations
- 🔑 JWT-based authentication
- 👤 User profile display in header
- 💚 Auth-protected favorites (must login to save)
- 🔄 Automatic token management
- 📱 Fully responsive auth UI

**Backend:**
- 🗄️ PostgreSQL database
- 🔒 Secure password hashing with bcrypt
- 🎫 JWT token generation
- ✅ Input validation
- 🛡️ Protected API routes
- 📊 User management system

## 📦 Files Created

### Frontend
```
codedex-api-template/
├── src/
│   ├── components/
│   │   ├── Login.jsx              ✨ NEW
│   │   ├── Register.jsx           ✨ NEW
│   │   └── Auth.css               ✨ NEW
│   ├── contexts/
│   │   └── AuthContext.jsx        ✨ NEW
│   ├── services/
│   │   └── api.js                 ✨ NEW
│   └── utils/
│       └── auth.js                ✨ NEW
└── .gitignore                     ✨ NEW
```

### Backend
```
backend/
├── config/
│   └── database.js                ✨ NEW
├── controllers/
│   ├── authController.js          ✨ NEW
│   └── favoritesController.js     ✨ NEW
├── middleware/
│   └── auth.js                    ✨ NEW
├── models/
│   └── database.sql               ✨ NEW
├── routes/
│   ├── auth.js                    ✨ NEW
│   └── favorites.js               ✨ NEW
├── server.js                      ✨ NEW
├── package.json                   ✨ NEW
└── .gitignore                     ✨ NEW
```

## ⚡ Quick Start (3 Steps)

### Step 1: Database Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE spotify_finder;
\q

# Run schema
cd backend
psql -U postgres -d spotify_finder -f models/database.sql
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Edit .env file with your database password
# Change: DB_PASSWORD=your_postgres_password
notepad .env

# Start server
npm start
```

You should see:
```
🔌 PostgreSQL connected successfully!
🚀 Server is running on port 5000
```

### Step 3: Frontend Setup

```bash
cd codedex-api-template

# Install dependencies (if not already installed)
npm install

# Edit .env with your Spotify credentials
# Add: VITE_CLIENT_ID and VITE_CLIENT_SECRET
notepad .env

# Start dev server
npm run dev
```

Visit: `http://localhost:5173`

## 🧪 Test It Out!

1. **Register**: Click the green "Register" button in the top right
2. **Login**: After registering, you'll be automatically logged in
3. **Search**: Use the search bar to find albums
4. **Favorite**: Click the heart icon on any album (now saved to database!)
5. **Logout**: Click the logout button
6. **Login Again**: Your favorites persist!

## 🔍 Testing the Backend API

```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Copy the token from the response and use it here:
curl -X GET http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🎨 UI Features

### Authentication Flow
- **Before Login**: Login/Register buttons in top right
- **After Login**: Username displayed with logout button
- **Favorites**: Heart icon now requires authentication
- **Modal**: Beautiful dark-themed auth modals with smooth animations

### User Experience
- Click "Register" → Auto-login after registration
- Try to favorite without login → Login modal appears
- All favorites sync with database in real-time
- Logout → Favorites clear from UI
- Login → Favorites reload from database

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLIENT_ID=your_spotify_client_id
VITE_CLIENT_SECRET=your_spotify_client_secret
```

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=spotify_finder
JWT_SECRET=change_this_to_a_random_secret_key
JWT_EXPIRE=7d
PORT=5000
```

## 🔐 Security Notes

⚠️ **Important for Production:**
1. Change `JWT_SECRET` to a long random string
2. Use HTTPS for both frontend and backend
3. Set secure CORS policies
4. Use environment-specific `.env` files
5. Never commit `.env` files to git (they're already in `.gitignore`)

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Make sure PostgreSQL is running
# Windows:
services.msc
# Find "postgresql" and ensure it's running
```

### Port Already in Use
```bash
# Backend (port 5000)
# Kill the process or change PORT in backend/.env

# Frontend (port 5173)
# Vite will automatically try the next available port
```

### CORS Errors
```javascript
// Already configured in backend/server.js
// If you change frontend port, update CORS origin
```

## 📚 Next Steps

Want to add more features? Here are some ideas:

1. **Email Verification**: Add email confirmation after registration
2. **Password Reset**: Implement forgot password functionality
3. **Social Login**: Add Google/Facebook OAuth
4. **User Profile**: Create a profile page with avatar upload
5. **Sharing**: Let users share their favorite albums
6. **Playlists**: Group favorites into custom playlists
7. **Search History**: Save user search history
8. **Recommendations**: Show personalized album recommendations

## 🆘 Need Help?

If you run into issues:

1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify all environment variables are set correctly
4. Make sure PostgreSQL is running
5. Try restarting both servers

## ✨ What Changed in Existing Files

### App.jsx
- Added auth context integration
- Updated favorites to use backend API
- Added login/register modal states
- Modified toggleFavorite to check authentication
- Updated top navigation to show login/register or user info

### main.jsx
- Wrapped app with AuthProvider

### index.html
- Added viewport meta tag for mobile responsiveness

All other files remain unchanged!

---

🎉 **You're all set!** Your Spotify Album Finder now has a complete authentication system with database persistence.

