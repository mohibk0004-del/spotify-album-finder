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

