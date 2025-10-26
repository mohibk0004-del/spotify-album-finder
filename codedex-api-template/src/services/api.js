import { getToken } from '../utils/auth';

// Automatically detect if we're on local network
const getApiBaseUrl = () => {
    // Check if we have an env variable
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // If accessing from network IP, use network IP for API
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:3000/api`;
    }

    // Default to localhost
    return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug: Log the API URL being used
console.log('🔗 API Base URL:', API_BASE_URL);

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Check if response has content
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            const text = await response.text();
            data = text ? JSON.parse(text) : {};
        } else {
            data = { message: 'Invalid response format' };
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || `API request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Cannot connect to server. Make sure the backend is running on port 3000.');
        }
        throw error;
    }
};

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        return apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    login: async (credentials) => {
        return apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    getProfile: async () => {
        return apiCall('/auth/profile');
    },

    updateProfile: async (userData) => {
        return apiCall('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    changePassword: async (passwords) => {
        return apiCall('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwords),
        });
    },
};

// Favorites API calls
export const favoritesAPI = {
    getAll: async () => {
        return apiCall('/favorites');
    },

    add: async (albumData) => {
        return apiCall('/favorites', {
            method: 'POST',
            body: JSON.stringify(albumData),
        });
    },

    remove: async (albumId) => {
        return apiCall(`/favorites/${albumId}`, {
            method: 'DELETE',
        });
    },

    check: async (albumId) => {
        return apiCall(`/favorites/check/${albumId}`);
    },
};

// Health check
export const checkHealth = async () => {
    return apiCall('/health');
};

