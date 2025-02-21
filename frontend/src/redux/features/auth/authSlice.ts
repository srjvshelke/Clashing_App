import { LOGIN_URL, REGISTER_URL } from '@/lib/apiEndPoints';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from "axios";

// User interface
interface User {
  id?: string;
  name: string;
  email: string; 
  password: string;
  token: string;
}

// Error interface
interface ErrorType {
  name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

// Authentication state interface
interface AuthState {
  user: User | null;
  loading: boolean;
  msg: string;
  status: number;
  error: ErrorType ;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  msg: "",
  status: 0,
  error: {},
};

// API config for form-data
const config = {
  headers: { "Content-Type": "application/json" },
};

// 🔹 Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    userData: { name: string; email: string; password: string; confirm_password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(REGISTER_URL, userData, config);
      return {
        status: 200,
        message: "Account created successfully! Please check your email to verify your account.",
        error: {},
        data: response.data,
      };
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          return rejectWithValue({
            status: 422,
            message: error.response?.data?.message || "Validation error",
            error: error.response?.data?.errors || {},
          });
        }
      }
      return rejectWithValue({
        status: 500,
        message: "Something went wrong. Please try again!",
        error: {},
      });
    }
  }
);

// 🔹 Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(LOGIN_URL, credentials, config);
      console.log(` response`);
      
      return {
        status: 200,
        message: "Credentials matched loging you shortly!",
        error: {},
        data: response.data,
      };
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          return rejectWithValue({
            status: 422,
            message: error.response?.data?.message || "Invalid login details",
            error: error.response?.data?.errors || {},
          });
        }
      }
      

      return rejectWithValue({
        status: 500,
        message: "Login failed. Please try again later!",
        error: {},
      });
    }
  }
);

// 🔹 Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.msg = "";
      state.status = 0;
      state.error = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.msg = action.payload.message;
        state.status = action.payload.status;
        state.error = {};
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.msg = action.payload.message;
        state.status = action.payload.status;
        state.error = action.payload.error;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.msg = action.payload.message;
        state.status = action.payload.status;
        state.error = {};
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.msg = action.payload.message;
        state.status = action.payload.status;
        state.error = action.payload.error;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
