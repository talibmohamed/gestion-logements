// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nom: "",
  prenom: "",
  cin: "",
  email: "",
  telephone: "",
  profession: "",
  address: "",
  date_ajout: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {
        nom,
        prenom,
        cin,
        email,
        telephone,
        profession,
        address,
        date_ajout,
      } = action.payload;
      state.nom = nom;
      state.prenom = prenom;
      state.cin = cin;
      state.email = email;
      state.telephone = telephone;
      state.profession = profession;
      state.address = address;
      state.date_ajout = date_ajout;
    },
    // Add other user-related reducers as needed
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
