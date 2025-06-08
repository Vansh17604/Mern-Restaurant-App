import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import waiterService from "./waiterService";
import { toast } from "sonner";

const initialState = {
  waiters: [],
  profile: null,
  header: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};


// Register Waiter
export const registerWaiter = createAsyncThunk(
  "waiter/register",
  async (waiterData, thunkAPI) => {
    try {
      return await waiterService.registerWaiter(waiterData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Waiter registration failed");
    }
  }
);

// Fetch All Waiters
export const fetchAllWaiters = createAsyncThunk(
  "waiter/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await waiterService.fetchAllWaiters();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch waiters failed");
    }
  }
);

// Edit Waiter
export const editWaiter = createAsyncThunk(
  "waiter/edit",
  async ({ id, waiterData }, thunkAPI) => {
    try {
      return await waiterService.editWaiter(id, waiterData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Edit waiter failed");
    }
  }
);

// Delete Waiter
export const deleteWaiter = createAsyncThunk(
  "waiter/delete",
  async (id, thunkAPI) => {
    try {
      await waiterService.deleteWaiter(id);
      return id; // Return only ID to remove from state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Delete waiter failed");
    }
  }
);
export const changeWaiterPassword = createAsyncThunk(
  "waiter/changePassword",
  async ({ id, passwordData }, thunkAPI) => {
    try {
      return await waiterService.changeWaiterPassword(id, passwordData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Change password failed");
    }
  }
);

export const updateWaiterProfile = createAsyncThunk(
  "waiter/updateProfile",
  async ({ id, profileData }, thunkAPI) => {
    try {
      return await waiterService.updateWaiterProfile(id, profileData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Update profile failed");
    }
  }
);

export const fetchWaiterProfile = createAsyncThunk(
  "waiter/fetchProfile",
  async (id, thunkAPI) => {
    try {
      return await waiterService.fetchWaiterProfile(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetch profile failed");
    }
  }
);

export const fetchWaiterHeader = createAsyncThunk(
  "waiter/fetchHeader",
  async (id, thunkAPI) => {
    try {
      return await waiterService.fetchWaiterHeader(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetch header failed");
    }
  }
);

export const waiterSlice = createSlice({
  name: "waiter",
  initialState,
  reducers: {
    resetWaiterState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerWaiter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerWaiter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.waiters.push(action.payload);
        toast.success("Waiter registered");
      })
      .addCase(registerWaiter.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch All
      .addCase(fetchAllWaiters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllWaiters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.waiters = action.payload;
      })
      .addCase(fetchAllWaiters.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Edit
      .addCase(editWaiter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editWaiter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.waiters = state.waiters.map((waiter) =>
          waiter._id === action.payload._id ? action.payload : waiter
        );
        toast.success("Waiter updated");
      })
      .addCase(editWaiter.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Delete
      .addCase(deleteWaiter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWaiter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.waiters = state.waiters.filter(waiter => waiter._id !== action.payload);
        toast.success("Waiter deleted");
      })
      .addCase(deleteWaiter.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
            // Change Password
      .addCase(changeWaiterPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeWaiterPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Password changed");
      })
      .addCase(changeWaiterPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Update Profile
      .addCase(updateWaiterProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWaiterProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.waiters = state.waiters.map((waiter) =>
          waiter._id === action.payload.waiter._id ? action.payload.waiter : waiter
        );
        toast.success("Profile updated");
      })
      .addCase(updateWaiterProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch Single Waiter Profile
      .addCase(fetchWaiterProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWaiterProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
         state.profile = action.payload;
      })
      .addCase(fetchWaiterProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(fetchWaiterHeader.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWaiterHeader.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
          state.header = action.payload;
        
      })
      .addCase(fetchWaiterHeader.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });

  },
});

export const { resetWaiterState } = waiterSlice.actions;
export default waiterSlice.reducer;