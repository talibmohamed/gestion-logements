import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logements: [],
};

const logementSlice = createSlice({
  name: 'logement',
  initialState,
  reducers: {
    setLogements: (state, action) => {
      state.logements = action.payload;
    },
    addLogement: (state, action) => {
      state.logements.push(action.payload);
    },
    removeLogement: (state, action) => {
      state.logements = state.logements.filter(logement => logement.log_id !== action.payload.log_id);
    },
    updateLogement: (state, action) => {
      const index = state.logements.findIndex(logement => logement.log_id === action.payload.log_id);
      if (index !== -1) {
        state.logements[index] = action.payload;
      }
    },
  },
});

export const { setLogements, addLogement, removeLogement, updateLogement } = logementSlice.actions;

export default logementSlice.reducer;
