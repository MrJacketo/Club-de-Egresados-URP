// Authentication utilities for JWT
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

export const auth = {
  // Store token in localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Store user data
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user data
  getUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = auth.getToken();
    return !!token;
  },

  // Login function
  login: async (email, password) => {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, contraseña: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token and user data
    auth.setToken(data.token);
    auth.setUser(data.user);

    return data;
  },

  // Register function
  register: async (name, email, password) => {
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: name, email, contraseña: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Store token and user data
    auth.setToken(data.token);
    auth.setUser(data.user);

    return data;
  },

  // Logout function
  logout: () => {
    auth.removeToken();
    // No automatic redirect - let components handle navigation
  },

  // Get current user info from server
  getCurrentUser: async () => {
    const token = auth.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('http://localhost:8000/current-user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get user info');
    }

    auth.setUser(data.user);
    return data.user;
  }
};

export default auth;