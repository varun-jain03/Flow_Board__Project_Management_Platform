import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi.js";
import { storage } from "../../../shared/lib/storage.js";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.register(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload);
      storage.setTokens(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = storage.getRefreshToken();
      if (refreshToken) await authApi.logout({ refreshToken });
      storage.clearAuth();
      return null;
    } catch (err) {
      storage.clearAuth();
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!storage.getAccessToken(),
    loading: false,
    error: null,
    user: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      });
  },
});

export const { clearAuthError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
