// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/AxiosCli';

// --- Student Actions ---
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

// --- Mentor Actions ---
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

// --- Logout ---
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { userType } = getState().auth;
      if (userType === 'student') {
        await axiosClient.post('/student/logout');
      } else {
        await axiosClient.post('/auth/logout').catch(() => {});
      }
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// --- LocalStorage Persistence ---
const loadAuthFromStorage = () => {
  try {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      return JSON.parse(savedAuth);
    }
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
  }
  return {
    user: null,
    userType: null,
    isAuthenticated: false
  };
};

const savedAuth = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedAuth.user || null,
    userType: savedAuth.userType || null,
    isAuthenticated: savedAuth.isAuthenticated || false,
    loading: false,
    error: null,
  },
  reducers: {
    restoreAuth: (state, action) => {
      state.user = action.payload.user;
      state.userType = action.payload.userType;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const onPending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const onRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Something went wrong';
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

      if (state.isAuthenticated) {
        localStorage.setItem(
          'auth',
          JSON.stringify({
            user: state.user,
            userType: state.userType,
            isAuthenticated: true,
          })
        );
      }
    };

    builder
      // Student
      .addCase(studentRegister.pending, onPending)
      .addCase(studentRegister.rejected, onRejected)
      .addCase(studentRegister.fulfilled, onFulfilled)
      .addCase(studentLogin.pending, onPending)
      .addCase(studentLogin.rejected, onRejected)
      .addCase(studentLogin.fulfilled, onFulfilled)

      // Mentor
      .addCase(mentorRegister.pending, onPending)
      .addCase(mentorRegister.rejected, onRejected)
      .addCase(mentorRegister.fulfilled, onFulfilled)
      .addCase(mentorLogin.pending, onPending)
      .addCase(mentorLogin.rejected, onRejected)
      .addCase(mentorLogin.fulfilled, onFulfilled)

      // Logout
      .addCase(logout.pending, onPending)
      .addCase(logout.rejected, onRejected)
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.userType = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('auth'); 
      });
  },
});

export const { restoreAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
