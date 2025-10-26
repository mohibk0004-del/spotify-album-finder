import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import pool from '../config/database.js';

const SALT_ROUNDS = 10;

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Register new user
export const register = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, username, password } = req.body;

        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email or username already exists'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        const result = await pool.query(
            `INSERT INTO users (email, username, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, username, created_at`,
            [email, username, passwordHash]
        );

        const user = result.rows[0];

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = result.rows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, username, created_at, last_login FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user.id;

        // Check if username is taken
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND id != $2',
            [username, userId]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        const result = await pool.query(
            `UPDATE users SET username = $1 WHERE id = $2 
       RETURNING id, email, username, created_at`,
            [username, userId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get current password hash
        const result = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );

        const user = result.rows[0];

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newPasswordHash, userId]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};