
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../utils/AxiosCli";

// STUDENT THUNKS 
export const studRegister = createAsyncThunk(
  "auth/studentRegister",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/student/register", userData);
      return { user: data.user || data.student, role: "student" }; // tolerate legacy
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const studLogin = createAsyncThunk(
  "auth/studentLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/student/login", credentials);
      return { user: data.user, role: "student" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const studCheckAuth = createAsyncThunk(
  "auth/studentCheck",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/student/check");
      return { user: data.user, role: "student" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const studLogout = createAsyncThunk(
  "auth/studentLogout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/student/logout");
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//  MENTOR THUNKS 
export const mentorRegister = createAsyncThunk(
  "auth/mentorRegister",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/mentor/register", userData);
      return { user: data.user || data.registerMentor, role: "mentor" }; // tolerate legacy
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const mentorLogin = createAsyncThunk(
  "auth/mentorLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/mentor/login", credentials);
      return { user: data.user || data.findMentor, role: "mentor" }; // tolerate old shape
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



export const mentorCheckAuth = createAsyncThunk(
  "auth/mentorCheck",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/mentor/check");
      return { user: data.user, role: "mentor" };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const mentorLogout = createAsyncThunk(
  "auth/mentorLogout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/mentor/logout");
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// === AUTH SLICE ===
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null, // "student" | "mentor"
    loading: false,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- STUDENT ---
      .addCase(studRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(studRegister.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(studRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(studLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(studLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(studLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(studCheckAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.loading = false;
      })
      .addCase(studCheckAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
      .addCase(studLogout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // --- MENTOR ---
      .addCase(mentorRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mentorRegister.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(mentorRegister.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload;
      })
      .addCase(mentorLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mentorLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(mentorLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(mentorCheckAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.loading = false;
      })
      .addCase(mentorCheckAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        state.loading = false; 
      })
      .addCase(mentorLogout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
