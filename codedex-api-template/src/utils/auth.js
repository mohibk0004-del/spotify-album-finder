// Token management utilities

export const TOKEN_KEY = 'spotify_finder_token';
export const USER_KEY = 'spotify_finder_user';

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const setUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
};

export const logout = () => {
    removeToken();
    removeUser();
    // Remove old localStorage favorites if any
    localStorage.removeItem('spotify-favorites');
};

export const isAuthenticated = () => {
    return !!getToken();
};

