// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';

export const store = configureStore({
  reducer: { auth },
});
