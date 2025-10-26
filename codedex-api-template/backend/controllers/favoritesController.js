import pool from '../config/database.js';

// Get all favorites for authenticated user
export const getAllFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        res.json({
            success: true,
            count: result.rows.length,
            favorites: result.rows
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching favorites',
            error: error.message
        });
    }
};

// Add a favorite
export const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            album_id,
            album_name,
            artist_name,
            artist_id,
            image_url,
            spotify_url,
            release_date,
            total_tracks
        } = req.body;

        // Validate required fields
        if (!album_id || !album_name || !artist_name) {
            return res.status(400).json({
                success: false,
                message: 'Album ID, name, and artist name are required'
            });
        }

        // Check if already exists
        const checkExists = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND album_id = $2',
            [userId, album_id]
        );

        if (checkExists.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Album already in favorites'
            });
        }

        // Add favorite
        const result = await pool.query(
            `INSERT INTO favorites 
       (user_id, album_id, album_name, artist_name, artist_id, image_url, spotify_url, release_date, total_tracks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [userId, album_id, album_name, artist_name, artist_id, image_url, spotify_url, release_date, total_tracks]
        );

        res.status(201).json({
            success: true,
            message: 'Favorite added successfully',
            favorite: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding favorite',
            error: error.message
        });
    }
};

// Remove a favorite
export const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { albumId } = req.params;

        const result = await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND album_id = $2 RETURNING *',
            [userId, albumId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found'
            });
        }

        res.json({
            success: true,
            message: 'Favorite removed successfully',
            favorite: result.rows[0]
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing favorite',
            error: error.message
        });
    }
};

// Check if album is favorited
export const checkFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { albumId } = req.params;

        const result = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND album_id = $2',
            [userId, albumId]
        );

        res.json({
            success: true,
            isFavorite: result.rows.length > 0,
            favorite: result.rows[0] || null
        });
    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking favorite',
            error: error.message
        });
    }
};