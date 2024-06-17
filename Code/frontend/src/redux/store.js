import { configureStore } from '@reduxjs/toolkit';
import facultyHODAdminReducer from './slices/facultyHODAdminSlice';
import axios from 'axios';

const store = configureStore({
  reducer: {
    facultyHODAdmin: facultyHODAdminReducer,
  },
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default store;
