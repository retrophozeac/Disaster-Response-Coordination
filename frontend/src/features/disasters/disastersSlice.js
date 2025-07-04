import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

export const fetchDisasters = createAsyncThunk('disasters/fetchDisasters', async (tags, { rejectWithValue }) => {
  try {
    const { data } = await api.getDisasters(tags);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const disastersSlice = createSlice({
  name: 'disasters',
  initialState: {
    disasters: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisasters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisasters.fulfilled, (state, action) => {
        state.loading = false;
        state.disasters = action.payload;
      })
      .addCase(fetchDisasters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default disastersSlice.reducer;
