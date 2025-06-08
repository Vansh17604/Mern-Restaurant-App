// kitchenSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import kitchenService from "./kitchenService";
import { toast } from "sonner";

const initialState = {
  kitchens: [],
  kitchenProfile: null,
   kitchenHeader: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const markAllAttendance = createAsyncThunk(
  "kitchen/markAllAttendance",
  async (attendanceData, thunkAPI) => {
    try {
      return await kitchenService.markAllAttendance(attendanceData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Marking attendance failed");
    }
  }
);
export const changeKitchenPassword = createAsyncThunk(
  "kitchen/changePassword",
  async ({ id, passwordData }, thunkAPI) => {
    try {
      return await kitchenService.changeKitchenPassword(id, passwordData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Changing password failed");
    }
  }
);

// 📋 Fetch Kitchen Profile
export const fetchKitchenProfile = createAsyncThunk(
  "kitchen/fetchProfile",
  async (id, thunkAPI) => {
    try {
      return await kitchenService.fetchKitchenProfile(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching profile failed");
    }
  }
);

// 📝 Update Kitchen Profile
export const updateKitchenProfile = createAsyncThunk(
  "kitchen/updateProfile",
  async ({ id, profileData }, thunkAPI) => {
    try {
      return await kitchenService.updateKitchenProfile(id, profileData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Updating profile failed");
    }
  }
);

// Edit Attendance
export const editAttendance = createAsyncThunk(
  "kitchen/editAttendance",
  async ({ id, attendanceData }, thunkAPI) => {
    try {
      return await kitchenService.editAttendance(id, attendanceData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Editing attendance failed");
    }
  }
);

// Delete Attendance
export const deleteAttendance = createAsyncThunk(
  "kitchen/deleteAttendance",
  async ({ id, date }, thunkAPI) => {
    try {
      return await kitchenService.deleteAttendance(id, date);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Deleting attendance failed");
    }
  }
);

// Fetch All Attendance
export const fetchAllAttendance = createAsyncThunk(
  "kitchen/fetchAllAttendance",
  async (_, thunkAPI) => {
    try {
      return await kitchenService.fetchAllAttendance();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching attendance failed");
    }
  }
);

// Register Kitchen
export const registerKitchen = createAsyncThunk(
  "kitchen/register",
  async (kitchenData, thunkAPI) => {
    try {
      return await kitchenService.registerKitchen(kitchenData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Kitchen registration failed");
    }
  }
);

// Fetch All Kitchens
export const fetchAllKitchens = createAsyncThunk(
  "kitchen/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await kitchenService.fetchAllKitchens();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch kitchens failed");
    }
  }
);
export const fetchKitchenHeader = createAsyncThunk(
  "kitchen/fetchHeader",
  async (id, thunkAPI) => {
    try {
      return await kitchenService.fetchKitchenHeader(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching header failed");
    }
  }
);

// Edit Kitchen
export const editKitchen = createAsyncThunk(
  "kitchen/edit",
  async ({ id, kitchenData }, thunkAPI) => {
    try {
      return await kitchenService.editKitchen(id, kitchenData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Edit kitchen failed");
    }
  }
);

// Delete Kitchen
export const deleteKitchen = createAsyncThunk(
  "kitchen/delete",
  async (id, thunkAPI) => {
    try {
      await kitchenService.deleteKitchen(id);
      return id; // Return only ID to remove from state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Delete kitchen failed");
    }
  }
);

export const kitchenSlice = createSlice({
  name: "kitchen",
  initialState,
  reducers: {
    resetKitchenState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerKitchen.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerKitchen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kitchens.push(action.payload);
        toast.success("Kitchen registered");
      })
      .addCase(registerKitchen.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch All
      .addCase(fetchAllKitchens.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllKitchens.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kitchens = action.payload;
      })
      .addCase(fetchAllKitchens.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Edit
      .addCase(editKitchen.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editKitchen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kitchens = state.kitchens.map((kitchen) =>
          kitchen._id === action.payload._id ? action.payload : kitchen
        );
        toast.success("Kitchen updated");
      })
      .addCase(editKitchen.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Delete
      .addCase(deleteKitchen.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteKitchen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kitchens = state.kitchens.filter(kitchen => kitchen._id !== action.payload);
        toast.success("Kitchen deleted");
      })
      .addCase(deleteKitchen.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
       .addCase(changeKitchenPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeKitchenPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Password changed");
      })
      .addCase(changeKitchenPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // 📋 Fetch Profile
      .addCase(fetchKitchenProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchKitchenProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kitchenProfile = action.payload;
      })
      .addCase(fetchKitchenProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
        .addCase(fetchKitchenHeader.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchKitchenHeader.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kitchenHeader = action.payload; // { name, photo }
      })
      .addCase(fetchKitchenHeader.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(updateKitchenProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateKitchenProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kitchenProfile = action.payload.waiter || action.payload; // handle API shape
        toast.success("Profile updated");
      })
      .addCase(updateKitchenProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetKitchenState } = kitchenSlice.actions;
export default kitchenSlice.reducer;