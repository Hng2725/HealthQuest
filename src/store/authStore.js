import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      set({ user: response.data, token: response.data.token, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      localStorage.setItem('token', response.data.token);
      set({ user: response.data, token: response.data.token, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, error: error.response?.data?.message || 'Failed to fetch profile', isLoading: false });
    }
  }
}));

export default useAuthStore;
