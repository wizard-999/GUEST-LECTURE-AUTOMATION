import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'facultyHODAdmin/loginUser',
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/${userCredentials.role}-api/login`, userCredentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchApprovedGuestLectures = createAsyncThunk(
  'facultyHODAdmin/fetchApprovedGuestLectures',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/guestLectures/approved');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const facultyHODAdminSlice = createSlice({
  name: 'facultyHODAdmin',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    approvedGuestLectures: [],
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchApprovedGuestLectures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedGuestLectures.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedGuestLectures = action.payload;
      })
      .addCase(fetchApprovedGuestLectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = facultyHODAdminSlice.actions;
export default facultyHODAdminSlice.reducer;
