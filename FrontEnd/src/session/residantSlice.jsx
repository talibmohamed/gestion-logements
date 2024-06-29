import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  residants: [],
};

const residantSlice = createSlice({
    name: 'residant',
    initialState,
    reducers: {
      setResidants: (state, action) => {
        state.residants = action.payload;
      },
      addResidant: (state, action) => {
        state.residants.push(action.payload);
      },
      removeResidant: (state, action) => {
        state.residants = state.Residants.filter(residant => residant.res_id !== action.payload.res_id);
      },
      updateResidant: (state, action) => {
        const index = state.residants.findIndex(residant => residant.res_id === action.payload.res_id);
        if (index !== -1) {
          state.residants[index] = action.payload;
        }
      },
    },
  });
  
export const { setResidants, addResidant, removeResidant, updateResidant } = residantSlice.actions;

export default residantSlice.reducer;
