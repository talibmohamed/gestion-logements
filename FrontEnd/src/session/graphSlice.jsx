// graphSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  graphs: [],
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setgraphs: (state, action) => {
      state.graphs = action.payload;
    },
    addLogement: (state, action) => {
      state.graphs.push(action.payload);
    },
    removeLogement: (state, action) => {
      state.graphs = state.graphs.filter(graph => graph.log_id !== action.payload.log_id);
    },
    updateLogement: (state, action) => {
      const index = state.graphs.findIndex(graph => graph.log_id === action.payload.log_id);
      if (index !== -1) {
        state.graphs[index] = action.payload;
      }
    },
  },
});

export const { setgraphs, addLogement, removeLogement, updateLogement } = graphSlice.actions;

export default graphSlice.reducer;
