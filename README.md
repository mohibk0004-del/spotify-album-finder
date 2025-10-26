# 🎵 Spotify Album Finder

A modern, full-stack web application for discovering and saving your favorite Spotify albums. Built with React, Node.js, Express, and PostgreSQL.

## ✨ Features

- 🔍 **Search Albums**: Search for albums by artist name using the Spotify API
- ⭐ **Favorites System**: Save and manage your favorite albums (requires authentication)
- 🔐 **User Authentication**: Secure JWT-based email/password authentication
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🎨 **Smooth Animations**: Scroll-triggered animations and smooth transitions
- 🌙 **Dark Theme**: Sleek dark interface with Spotify green accents

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Spotify Developer Account](https://developer.spotify.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mohibk0004-del/spotify-album-finder.git
cd spotify-album-finder
```

### 2. Set Up Spotify API Credentials

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Copy your **Client ID** and **Client Secret**

### 3. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE spotify_finder;
\q
```

Then run the database schema:

```bash
cd backend
psql -U postgres -d spotify_finder -f models/database.sql
```

### 4. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=spotify_finder
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
EOF

# Start the backend server
npm start
```

The backend server will start on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd codedex-api-template

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_CLIENT_ID=your_spotify_client_id
VITE_CLIENT_SECRET=your_spotify_client_secret
EOF

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
spotify-album-finder/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── favoritesController.js # Favorites CRUD
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── models/
│   │   └── database.sql         # Database schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── favorites.js         # Favorites routes
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server
│
└── codedex-api-template/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Auth.css         # Auth modal styles
    │   │   ├── Login.jsx        # Login component
    │   │   └── Register.jsx     # Register component
    │   ├── contexts/
    │   │   └── AuthContext.jsx  # Auth state management
    │   ├── services/
    │   │   └── api.js           # API client
    │   ├── utils/
    │   │   └── auth.js          # Auth utilities
    │   ├── App.css              # Main styles
    │   ├── App.jsx              # Main component
    │   ├── index.css            # Global styles
    │   └── main.jsx             # Entry point
    ├── .env                     # Environment variables
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Favorites

- `GET /api/favorites` - Get all user favorites (protected)
- `POST /api/favorites` - Add album to favorites (protected)
- `DELETE /api/favorites/:albumId` - Remove from favorites (protected)
- `GET /api/favorites/check/:albumId` - Check if album is favorited (protected)

## 🧪 Testing the API

You can test the API using curl or any API client like Postman:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get favorites (replace YOUR_JWT_TOKEN with the token from login)
curl -X GET http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎨 Features Walkthrough

### Search Albums
1. Click the search icon to expand the search bar
2. Enter an artist name
3. Press Enter or click the search button
4. Browse through the albums with smooth animations

### Manage Favorites
1. Click the Register button to create an account
2. Login with your credentials
3. Click the heart icon on any album to save it
4. Scroll down to the Favorites section to view all saved albums
5. Click the heart again to remove from favorites

### Navigation
- Use the side navigation dots to jump between sections
- Smooth scroll snapping enhances the user experience
- Responsive design adapts to any screen size

## 🔧 Development

### Run Backend in Development Mode

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Run Frontend in Development Mode

```bash
cd codedex-api-template
npm run dev
```

### Build for Production

```bash
# Frontend
cd codedex-api-template
npm run build

# The build output will be in the dist/ directory
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Set environment variables in the hosting platform
4. Deploy!

### Backend (Heroku/Railway)

1. Push your code to GitHub
2. Create a new app on Heroku or Railway
3. Add PostgreSQL addon
4. Set environment variables
5. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**mohibk0004-del**
- GitHub: [@mohibk0004-del](https://github.com/mohibk0004-del)

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- Design inspiration from modern portfolio websites
- React and Vite communities

---

Made with ❤️ and ☕

