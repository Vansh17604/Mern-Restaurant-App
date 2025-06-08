import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";
import { toast } from "sonner";

const initialState = {
  admin: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// 🔐 Change Password
export const changePassword = createAsyncThunk(
  "admin/changePassword",
  async (passwordData, thunkAPI) => {
    try {
      return await adminService.changePassword(passwordData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Password change failed");
    }
  }
);

// 🧑‍💼 Update Profile
export const updateAdminProfile = createAsyncThunk(
  "admin/updateProfile",
  async ({ id, profileData }, thunkAPI) => {
    try {
      return await adminService.updateAdminProfile(id, profileData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Profile update failed");
    }
  }
);

// 🔍 Fetch Admin Details
export const fetchAdminDetails = createAsyncThunk(
  "admin/fetchDetails",
  async (adminId, thunkAPI) => {
    try {
      return await adminService.fetchAdminDetails(adminId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Failed to fetch admin details");
    }
  }
);

// 🧠 Admin Slice
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Password changed successfully");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Update Profile
      .addCase(updateAdminProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload?.admin || null;
        toast.success("Profile updated successfully");
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchAdminDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload || null;
      })
      .addCase(fetchAdminDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
