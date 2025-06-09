import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from './authService';
import { toast } from 'sonner';

const initialState = {
  user: null,
  role: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.Login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Login failed");
    }
  }
);

export const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (_, thunkAPI) => {
    try {
      return await authService.validateToken();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Token invalid");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      return await authService.Logout();
    } catch (error) {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearAuth: (state) => {
      state.user = null;
      state.role = null;
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        // Extract role from the payload - adjust this based on your API response structure
        state.role = action.payload?.role || action.payload?.user?.role;
        toast.success("Login successful");
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.role = null;
        toast.error(action.payload);
      })
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        // state.message = action.payload;
        state.user = null;
        state.role = null;
        toast.error("Session expired. Please login again.");
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isSuccess = false;
        state.isLoading = false;
        toast.success("Logged out successfully");
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload || "Logout failed");
      });
  },
});

export const { reset, clearAuth } = authSlice.actions;
export default authSlice.reducer;