import express from 'express';
import {
    getAllFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
} from '../controllers/favoritesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', getAllFavorites);
router.post('/', addFavorite);
router.delete('/:albumId', removeFavorite);
router.get('/check/:albumId', checkFavorite);

export default router;