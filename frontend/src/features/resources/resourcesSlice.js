import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

export const fetchResources = createAsyncThunk('resources/fetchResources', async (disasterId, { rejectWithValue }) => {
  try {
    const { data } = await api.getResources(disasterId);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const resourcesSlice = createSlice({
  name: 'resources',
  initialState: {
    resources: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resourcesSlice.reducer;
