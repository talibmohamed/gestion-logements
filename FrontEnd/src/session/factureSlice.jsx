// factureSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  factures: [],
};

const factureSlice = createSlice({
  name: 'facture',
  initialState,
  reducers: {
    setFacture: (state, action) => {
      state.factures = action.payload;
    },
    addFacture: (state, action) => {
      state.factures.push(action.payload);
    },
    removeFacture: (state, action) => {
      state.factures = state.factures.filter(facture => facture.id !== action.payload.id);
    },
    updateFacture: (state, action) => {
      const index = state.factures.findIndex(facture => facture.res_id === action.payload.id);
      if (index !== -1) {
        state.factures[index] = action.payload;
      }
    },
  },
});

export const { setFacture, addFacture, removeFacture, updateFacture } = factureSlice.actions;

export default factureSlice.reducer;
