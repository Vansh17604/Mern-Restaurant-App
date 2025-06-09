// countSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import countService from "./countService";
import { toast } from "sonner";

const initialState = {
  dashboardStats: {},
  kitchenfooter: [],
  hourlyOrders: [],
  weeklySales: [],
  menuPopularity: [],
  recentOrders: [],
  footerStats: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get Dashboard Stats
export const getDashboardStats = createAsyncThunk(
  "count/getDashboardStats",
  async (_, thunkAPI) => {
    try {
      return await countService.getDashboardStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching dashboard stats failed");
    }
  }
);

// Get Hourly Orders
export const getHourlyOrders = createAsyncThunk(
  "count/getHourlyOrders",
  async (_, thunkAPI) => {
    try {
      return await countService.getHourlyOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching hourly orders failed");
    }
  }
);

// Get Weekly Sales
export const getWeeklySales = createAsyncThunk(
  "count/getWeeklySales",
  async (_, thunkAPI) => {
    try {
      return await countService.getWeeklySales();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching weekly sales failed");
    }
  }
);

// Get Menu Popularity
export const getMenuPopularity = createAsyncThunk(
  "count/getMenuPopularity",
  async (_, thunkAPI) => {
    try {
      return await countService.getMenuPopularity();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching menu popularity failed");
    }
  }
);

// Get Recent Orders
export const getRecentOrders = createAsyncThunk(
  "count/getRecentOrders",
  async (_, thunkAPI) => {
    try {
      return await countService.getRecentOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching recent orders failed");
    }
  }
);

export const getAdminFooterStats= createAsyncThunk(
  "count/getAdminFooterStats",
  async (_, thunkAPI) =>{
    
      try {
        return await countService.getAdnminFooter();
        } catch (error) {
          return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching admin footer stats failed");
          }
        }
          
);
export const getKitchenFooterStats = createAsyncThunk(
  "count/getKitchenFooterStats",
  async (_, thunkAPI) => {
    try {
      return await countService.getKitchenFooter();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetching kitchen footer stats failed");
    }
  }
);

export const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    resetCountState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Hourly Orders
      .addCase(getHourlyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHourlyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hourlyOrders = action.payload;
      })
      .addCase(getHourlyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getKitchenFooterStats.pending, (state) => {
  state.isLoading = true;
})
.addCase(getKitchenFooterStats.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.kitchenfooter = action.payload;
})
.addCase(getKitchenFooterStats.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
  toast.error(action.payload);
})


      // Weekly Sales
      .addCase(getWeeklySales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWeeklySales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.weeklySales = action.payload;
      })
      .addCase(getWeeklySales.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getAdminFooterStats.pending,(state)=>{
        state.isLoading=true;
      })
      .addCase(getAdminFooterStats.fulfilled,(state,action)=>
        {
          state.isLoading=false;
          state.isSuccess=true;
          state.footerStats=action.payload;
          })
          .addCase(getAdminFooterStats.rejected,(state,action)=>
            {
              state.isLoading=false;
              state.isError=true;
              state.message=action.payload;
              toast.error(action.payload);
              })

      // Menu Popularity
      .addCase(getMenuPopularity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMenuPopularity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.menuPopularity = action.payload;
      })
      .addCase(getMenuPopularity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Recent Orders
      .addCase(getRecentOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecentOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recentOrders = action.payload;
      })
      .addCase(getRecentOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetCountState } = countSlice.actions;
export default countSlice.reducer;