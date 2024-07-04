// consumSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  consums: [],
};

const consumSlice = createSlice({
  name: 'consum',
  initialState,
  reducers: {
    setConsums: (state, action) => {
      state.consums = action.payload;
    },
    addConsum: (state, action) => {
      state.consums.push(action.payload);
    },
    updateConsum: (state, action) => {
      const index = state.consums.findIndex(consum => consum.cons_id === action.payload.cons_id);
      if (index !== -1) {
        state.consums[index] = action.payload;
      }
    },
  },
});

export const { setConsums, addConsum, updateConsum } = consumSlice.actions;

export default consumSlice.reducer;