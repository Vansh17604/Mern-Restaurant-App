import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dishService from "./dishService";
import { toast } from "sonner";

const initialState = {
  dishes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create Dish
export const createDish = createAsyncThunk(
  "dish/create",
  async (dishData, thunkAPI) => {
    try {
      return await dishService.createDish(dishData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Create dish failed");
    }
  }
);

// Fetch All Dishes
export const fetchDishes = createAsyncThunk(
  "dish/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await dishService.fetchDishes();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch dishes failed");
    }
  }
);

// Fetch Only Active Dishes
export const fetchActiveDishes = createAsyncThunk(
  "dish/fetchActive",
  async (_, thunkAPI) => {
    try {
      return await dishService.fetchActiveDishes();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch active dishes failed");
    }
  }
);

// Update Dish
export const updateDish = createAsyncThunk(
  "dish/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await dishService.editDish(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Update dish failed");
    }
  }
);

// Delete Dish
export const deleteDish = createAsyncThunk(
  "dish/delete",
  async (id, thunkAPI) => {
    try {
      return await dishService.deleteDish(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Delete dish failed");
    }
  }
);
export const updateDishPriceAndCurrency = createAsyncThunk(
  "dish/updatePriceCurrency",
  async (data, thunkAPI) => {
    try {
      return await dishService.updateDishPriceAndCurrency(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update price and currency failed"
      );
    }
  }
);

export const dishSlice = createSlice({
  name: "dish",
  initialState,
  reducers: {
    resetDishState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(createDish.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dishes.push(action.payload);
        toast.success("Dish created");
      })
      .addCase(createDish.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Fetch All
      .addCase(fetchDishes.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dishes = action.payload;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
     .addCase(updateDishPriceAndCurrency.pending, (state) => {
  state.isLoading = true;
})
.addCase(updateDishPriceAndCurrency.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.dishes = action.payload.dishes || []; 
  toast.success("All dish prices & currencies updated");
})
.addCase(updateDishPriceAndCurrency.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
  toast.error(action.payload);
})


      // Fetch Active
      .addCase(fetchActiveDishes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveDishes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dishes = action.payload;
      })
      .addCase(fetchActiveDishes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Update
      .addCase(updateDish.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dishes = state.dishes.map((dish) =>
          dish._id === action.payload._id ? action.payload : dish
        );
        toast.success("Dish updated");
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Delete
      .addCase(deleteDish.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dishes = state.dishes.filter(dish => dish._id !== action.meta.arg);
        toast.success("Dish deleted");
      })
      .addCase(deleteDish.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetDishState } = dishSlice.actions;
export default dishSlice.reducer;
