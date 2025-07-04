import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

export const fetchReports = createAsyncThunk('reports/fetchReports', async (disasterId, { rejectWithValue }) => {
  try {
    const { data } = await api.getReports(disasterId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportsSlice.reducer;
