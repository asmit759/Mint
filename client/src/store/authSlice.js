// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/AxiosCli';

// Student
export const studentRegister = createAsyncThunk(
  'auth/studentRegister',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/student/register', payload);
      return { userType: 'student', user: data.student };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const studentLogin = createAsyncThunk(
  'auth/studentLogin',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/student/login', payload);
      return { userType: 'student', user: data.student };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Mentor
export const mentorRegister = createAsyncThunk(
  'auth/mentorRegister',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/mentor/register', payload);
      return { userType: 'mentor', user: data.registerMentor };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const mentorLogin = createAsyncThunk(
  'auth/mentorLogin',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/mentor/login', payload);
      return { userType: 'mentor', user: data.findMentor };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Logout based on current role
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { userType } = getState().auth;
      if (userType === 'student') {
        await axiosClient.post('/student/logout');
      } else if (userType === 'mentor') {
        // If you add mentor logout later, call it; else clear cookie generically if available
        await axiosClient.post('/auth/logout').catch(() => {});
      } else {
        await axiosClient.post('/auth/logout').catch(() => {});
      }
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    userType: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const onPending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const onRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Something went wrong';
      // Do not force-clear user on rejected register if someone is already logged in.
      if (!state.isAuthenticated) {
        state.user = null;
        state.userType = null;
      }
    };
    const onFulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.userType = action.payload?.userType || null;
      state.isAuthenticated = !!action.payload?.user;
      state.error = null;
    };

    builder
      // student
      .addCase(studentRegister.pending, onPending)
      .addCase(studentRegister.rejected, onRejected)
      .addCase(studentRegister.fulfilled, onFulfilled)

      .addCase(studentLogin.pending, onPending)
      .addCase(studentLogin.rejected, onRejected)
      .addCase(studentLogin.fulfilled, onFulfilled)

      // mentor
      .addCase(mentorRegister.pending, onPending)
      .addCase(mentorRegister.rejected, onRejected)
      .addCase(mentorRegister.fulfilled, onFulfilled)

      .addCase(mentorLogin.pending, onPending)
      .addCase(mentorLogin.rejected, onRejected)
      .addCase(mentorLogin.fulfilled, onFulfilled)

      // logout
      .addCase(logout.pending, onPending)
      .addCase(logout.rejected, onRejected)
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.userType = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
