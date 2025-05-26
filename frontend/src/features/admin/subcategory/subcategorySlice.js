import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import subcategoryService from "./subcategoryService";
import { toast } from "sonner";

const initialState = {
  subcategories: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Create Subcategory
export const createSubcategory = createAsyncThunk(
  "subcategory/create",
  async (data, thunkAPI) => {
    try {
      return await subcategoryService.createSubcategory(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create subcategory failed"
      );
    }
  }
);

// Fetch All Subcategories
export const fetchSubcategory = createAsyncThunk(
  "subcategory/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await subcategoryService.fetchSubcategory();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch subcategories failed"
      );
    }
  }
);

// Fetch Active Subcategories
export const fetchActiveSubcategory = createAsyncThunk(
  "subcategory/fetchActive",
  async (_, thunkAPI) => {
    try {
      return await subcategoryService.fetchActiveSubcategory();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch active subcategories failed"
      );
    }
  }
);

// Update Subcategory
export const updateSubcategory = createAsyncThunk(
  "subcategory/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await subcategoryService.updateSubcategory(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update subcategory failed"
      );
    }
  }
);

// Update Subcategory Status
export const updateSubcategoryStatus = createAsyncThunk(
  "subcategory/updateStatus",
  async ({ id, data }, thunkAPI) => {
    try {
      return await subcategoryService.updateSubcategoryStatus(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update status failed"
      );
    }
  }
);

// Delete Subcategory
export const deleteSubcategory = createAsyncThunk(
  "subcategory/delete",
  async (id, thunkAPI) => {
    try {
      return await subcategoryService.deleteSubcategory(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete subcategory failed"
      );
    }
  }
);

const subcategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {
    resetSubcategoryState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subcategories.push(action.payload);
        toast.success("Subcategory created");
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch All
      .addCase(fetchSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch Active
      .addCase(fetchActiveSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subcategories = action.payload;
      })
      .addCase(fetchActiveSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Update
      .addCase(updateSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subcategories = state.subcategories.map((subcat) =>
          subcat._id === action.payload._id ? action.payload : subcat
        );
        toast.success("Subcategory updated");
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Update Status
      .addCase(updateSubcategoryStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubcategoryStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subcategories = state.subcategories.map((subcat) =>
          subcat._id === action.payload._id ? action.payload : subcat
        );
        toast.success("Subcategory status updated");
      })
      .addCase(updateSubcategoryStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Delete
      .addCase(deleteSubcategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subcategories = state.subcategories.filter(
          (subcat) => subcat._id !== action.meta.arg
        );
        toast.success("Subcategory deleted");
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetSubcategoryState } = subcategorySlice.actions;
export default subcategorySlice.reducer;
