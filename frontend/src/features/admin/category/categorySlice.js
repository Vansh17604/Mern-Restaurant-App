import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "./categoryService";
import { toast } from "sonner";

const initialState = {
  categories: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create Category
export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData, thunkAPI) => {
    try {
      return await categoryService.createCategory(categoryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Create category failed");
    }
  }
);

// Fetch All Categories
export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await categoryService.fetchCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch categories failed");
    }
  }
);
export const fetchactiveCategories = createAsyncThunk("category/fetchactive", async(_,thunkAPI)=>{
  try {
    return await categoryService.fetchactiveCategory();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch active categories failed");
      }
});

// Update Category
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await categoryService.EditCategory(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);
export const updateCategoryStatus = createAsyncThunk(
  "category/updatestatus",
  async({id,data}, thunkAPI)=>{
    try{
       return await categoryService.EditCategoryStatus(id, data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
)

// Delete Category
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, thunkAPI) => {
    try {
      return await categoryService.DeleteCategory(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload);
        toast.success("Category created");
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.isError=false;
        state.isSuccess=false;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchactiveCategories.pending, (state) => {
        state.isLoading = true;
        state.isError=false;
        state.isSuccess=false;
      })
      .addCase(fetchactiveCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(fetchactiveCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      

      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.map(cat =>
          cat._id === action.payload._id ? action.payload : cat
        );
        toast.success("Category updated");
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
 .addCase(updateCategoryStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.map(cat =>
          cat._id === action.payload._id ? action.payload : cat
        );
        toast.success("Category status updated");
      })
      .addCase(updateCategoryStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(cat => cat._id !== action.meta.arg);
        toast.success("Category deleted");
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
