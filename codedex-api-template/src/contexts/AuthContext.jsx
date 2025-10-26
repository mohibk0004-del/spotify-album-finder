import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import {
    setToken,
    getToken,
    setUser,
    getUser,
    logout as logoutUtil,
    isAuthenticated as checkAuth
} from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(getUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const initAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    const response = await authAPI.getProfile();
                    setUserState(response.user);
                    setUser(response.user);
                } catch (error) {
                    console.error('Auth init error:', error);
                    logoutUtil();
                    setUserState(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            setToken(response.token);
            setUser(response.user);
            setUserState(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            setToken(response.token);
            setUser(response.user);
            setUserState(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        logoutUtil();
        setUserState(null);
    };

    const isAuthenticated = () => {
        return checkAuth();
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

