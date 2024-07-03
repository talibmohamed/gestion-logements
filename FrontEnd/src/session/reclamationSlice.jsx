import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reclamations: [],
};

const reclamationSlice = createSlice({
  name: "reclamation",
  initialState,
  reducers: {
    setReclamations: (state, action) => {
      state.reclamations = action.payload;
    },
    removeReclamation: (state, action) => {
      state.reclamations = state.reclamations.filter(
        (reclamation) => reclamation.res_id !== action.payload.res_id
      );
    },
    updateReclamation: (state, action) => {
      const index = state.reclamations.findIndex(
        (reclamation) => reclamation.res_id === action.payload.res_id
      );
      if (index !== -1) {
        state.reclamations[index] = action.payload;
      }
    },
  },
});

export const { setReclamations, addReclamation, removeReclamation, updateReclamation } =
  reclamationSlice.actions;

export default reclamationSlice.reducer;
