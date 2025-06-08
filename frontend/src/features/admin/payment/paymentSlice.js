import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";
import { toast } from "sonner";

const initialState = {  
  payments: [],
  singlePayment: null, 
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create Payment
export const createPayment = createAsyncThunk(
  "payment/create",
  async (paymentData, thunkAPI) => {
    try {
      return await paymentService.createPayment(paymentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Create payment failed");
    }
  }
);
export const fetchPaymentByOrderId = createAsyncThunk(
  "payment/fetchByOrderId",
  async (orderId, thunkAPI) => {
    try {
      return await paymentService.fetchPaymentByOrderId(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetch payment by order ID failed");
    }
  }
);


// Fetch All Payments
export const fetchAllPayments = createAsyncThunk(
  "payment/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await paymentService.getAllPayments();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Fetch payments failed");
    }
  }
);
export const generateBill = createAsyncThunk(
  "payment/generateBill",
  async (paymentId, thunkAPI) => {
    try {
      return await paymentService.generateBill(paymentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.msg || "Generate bill failed");
    }
  }
);

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payments.push(action.payload.payment);
        toast.success("Payment created");
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Fetch Payment By Order ID
.addCase(fetchPaymentByOrderId.pending, (state) => {
  state.isLoading = true;
})
.addCase(fetchPaymentByOrderId.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.singlePayment = action.payload;
  toast.success("Payment fetched successfully");
})
.addCase(fetchPaymentByOrderId.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
  toast.error(action.payload);
})


      // Fetch Payments
      .addCase(fetchAllPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payments = action.payload;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(generateBill.pending, (state) => {
  state.isLoading = true;
})
.addCase(generateBill.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  toast.success("Bill generated successfully");
})
.addCase(generateBill.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
  toast.error(action.payload);
});
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
