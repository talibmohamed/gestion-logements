// statisticsSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  statistics: null,
  loading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setStatistics(state, action) {
      state.statistics = action.payload;
      state.loading = false;
      state.error = null;
    },
    setStatisticsLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setStatisticsError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setStatistics,
  setStatisticsLoading,
  setStatisticsError,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
