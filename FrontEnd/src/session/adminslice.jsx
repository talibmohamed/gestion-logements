// adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nom: "",
  prenom: "",
  email: "",
  // Add other admin-related state properties as needed
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      const { nom, prenom, email } = action.payload;
      state.nom = nom;
      state.prenom = prenom;
      state.email = email;
      // Set other admin-related state properties as needed
    },
    // Add other admin-related reducers as needed
  },
});

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;
