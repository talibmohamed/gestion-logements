// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nom: '',
  prenom: '',
  cin: '',
  email: '',
  telephone: '',
  profession: '',
  facture: [], // Array to hold user's facture
  // Add other user-related state properties as needed
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { nom, prenom, cin, email, telephone, profession, facture } = action.payload;
      state.nom = nom;
      state.prenom = prenom;
      state.cin = cin;
      state.email = email;
      state.telephone = telephone;
      state.profession = profession;
      state.facture = facture; // Set the user's facture
    },
    // Add other user-related reducers as needed
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
