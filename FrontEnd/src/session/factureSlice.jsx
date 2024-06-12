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
  },
});

export const { setFacture, addFacture, removeFacture } = factureSlice.actions;

export default factureSlice.reducer;
