import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3001',
        'http://localhost:5173',
        'http://192.168.18.12:3001',
        'http://192.168.18.12:5173',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            success: true,
            message: 'Server is running',
            database: 'Connected',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection error',
            error: error.message
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Spotify Album Finder API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/profile',
            favorites: 'GET /api/favorites',
            addFavorite: 'POST /api/favorites',
            removeFavorite: 'DELETE /api/favorites/:albumId'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    console.log(`🔗 Network: http://192.168.18.12:${PORT}`);
    console.log('═══════════════════════════════════════');
});