import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  date_creation: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      const { nom, prenom, email, telephone, date_creation } = action.payload;
      state.nom = nom;
      state.prenom = prenom;
      state.email = email;
      state.telephone = telephone;
      state.date_creation = date_creation;
    },
    // Add other admin-related reducers as needed
  },
});

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;
