import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({ tasks: [response.data, ...state.tasks], isLoading: false }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create task', isLoading: false });
    }
  },

  completeTask: async (taskId) => {
     set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.patch(`http://localhost:5000/api/tasks/${taskId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { rewards, message } = response.data;

      // Only mark as completed if it's a custom task (we don't get the task type here easily, 
      // but let's re-fetch tasks to be perfectly in sync with the backend)
      await get().fetchTasks();

      // Update user stats in authStore instantly
      if (rewards) {
         useAuthStore.setState((state) => ({
           user: {
             ...state.user,
             exp: rewards.newExp,
             coins: rewards.newCoins,
             level: rewards.newLevel
           }
         }));
      } else {
         useAuthStore.getState().fetchProfile();
      }
      
      return response.data; // Return rewards info to show notification
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to complete task', isLoading: false });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        tasks: state.tasks.filter(t => t._id !== taskId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete task', isLoading: false });
    }
  }
}));

export default useTaskStore;
