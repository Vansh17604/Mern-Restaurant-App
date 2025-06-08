import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";
import { toast } from "sonner";

const initialState = {
  orders: [],
  selectedOrder: null, 
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};


export const fetchOrderbyOrderId = createAsyncThunk("order/fetchByOrderId", async (orderId, thunkAPI) => {
  try {
    return await orderService.fetchOrderbyOrderId(orderId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch order by ID failed");
  }
});
export const fetchAllOrdersForAdmin = createAsyncThunk(
  "order/fetchAllForAdmin",
  async (_, thunkAPI) => {
    try {
      return await orderService.fetchAllOrdersForAdmin();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch all admin orders failed"
      );
    }
  }
);

export const createOrder = createAsyncThunk("order/create", async (data, thunkAPI) => {
  try {
    return await orderService.createOrder(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Create order failed");
  }
});

export const deleteOrder = createAsyncThunk("order/delete", async (id, thunkAPI) => {
  try {
    return await orderService.deleteOrder(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Delete order failed");
  }
});

export const updateOrderDishes = createAsyncThunk("order/updateDishes", async ({ id, dishes }, thunkAPI) => {
  try {
    return await orderService.updateOrderDishes(id, { dishes });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Update dishes failed");
  }
});

export const fetchOrderbyWaiterId = createAsyncThunk(
  "order/fetchByWaiterId",
  async ( id , thunkAPI) => {
    try {
      return await orderService.fetchOrderbyWaiterId(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch orders failed");
    }
  }
);
export const fetchOrderByTableAndWaiter = createAsyncThunk(
  "order/fetchByTableAndWaiter",
  async ({ tableId, waiterId }, thunkAPI) => {
    try {
      return await orderService.fetchOrderByTableAndWaiter(tableId, waiterId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch orders by table/waiter failed");
    }
  }
);
export const fetchAllOrders = createAsyncThunk("order/fetchAll", async (_, thunkAPI) => {
  try {
    return await orderService.fetchAllOrders();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch all orders failed");
  }
});

export const assignKitchen = createAsyncThunk("order/assignKitchen", async ({orderId,dishId,kitchenId}, thunkAPI) => {
  try {
    return await orderService.assignKitchen({orderId,dishId,kitchenId});
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Assign kitchen failed");
  }
});

export const markOrderAsPrepared = createAsyncThunk("order/markPrepared", async ({orderId,dishId}, thunkAPI) => {
  try {
    return await orderService.markOrderAsPrepared({orderId,dishId});
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Mark as prepared failed");
  }
});
export const markOrderAsServed = createAsyncThunk("order/markServed", async(orderId,thunkAPI)=>{
  try {
    return await orderService.markOrderAsServed(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Mark as served failed");
      }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
  resetOrderState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.selectedOrder = null;
      state.tableOrders = [];
    },
    clearTableOrders: (state) => {
      state.tableOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders.push(action.payload);
        toast.success("Order created");
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
            .addCase(fetchAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = state.orders.filter((order) => order._id !== action.meta.arg);
        toast.success("Order deleted");
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Update Order Dishes
      .addCase(updateOrderDishes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderDishes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = state.orders.map((order) =>
          order._id === action.payload.order._id ? action.payload.order : order
        );
        toast.success("Order updated");
      })
      .addCase(updateOrderDishes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

            // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Assign Kitchen
      .addCase(assignKitchen.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignKitchen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        toast.success("Kitchen assigned");
      })
      .addCase(assignKitchen.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      // Mark as Prepared
      .addCase(markOrderAsPrepared.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markOrderAsPrepared.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        toast.success("Order marked as prepared");
      })
      .addCase(markOrderAsPrepared.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(markOrderAsServed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markOrderAsServed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        toast.success("Order marked as prepared");
      })
      .addCase(markOrderAsServed.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchOrderbyWaiterId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderbyWaiterId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(fetchOrderbyWaiterId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(fetchOrderByTableAndWaiter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderByTableAndWaiter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(fetchOrderByTableAndWaiter.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchOrderbyOrderId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderbyOrderId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderbyOrderId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetOrderState,clearTableOrders  } = orderSlice.actions;
export default orderSlice.reducer;
