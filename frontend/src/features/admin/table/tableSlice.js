import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tableService from "./tableService";
import { toast } from "sonner";

const initialState = {
  tables: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Create Table
export const createTable = createAsyncThunk("table/create", async (data, thunkAPI) => {
  try {
    return await tableService.createTable(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Create table failed");
  }
});

// Fetch All Tables
export const fetchTables = createAsyncThunk("table/fetchAll", async (_, thunkAPI) => {
  try {
    return await tableService.fetchAllTables();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch tables failed");
  }
});

// Fetch Available Tables
export const fetchAvailableTables = createAsyncThunk("table/fetchAvailable", async (_, thunkAPI) => {
  try {
    return await tableService.fetchAvailableTables();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch available tables failed");
  }
});

// Update Table

// Delete Table
export const deleteTable = createAsyncThunk("table/delete", async (id, thunkAPI) => {
  try {
    return await tableService.deleteTable(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Delete table failed");
  }
});

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    resetTableState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createTable.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tables.push(action.payload);
        toast.success("Table created");
      })
      .addCase(createTable.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch All
      .addCase(fetchTables.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch Available
      .addCase(fetchAvailableTables.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableTables.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tables = action.payload;
      })
      .addCase(fetchAvailableTables.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

    

      // Delete
      .addCase(deleteTable.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tables = state.tables.filter((table) => table._id !== action.meta.arg);
        toast.success("Table deleted");
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetTableState } = tableSlice.actions;
export default tableSlice.reducer;
