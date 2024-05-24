import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jwtToken: null,
  nom: '',
  prenom: '',
  role: '',  
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.jwtToken = action.payload.jwtToken;
      state.nom = action.payload.nom;
      state.prenom = action.payload.prenom;
      state.role = action.payload.role;  
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.jwtToken = null;
      state.nom = '';
      state.prenom = '';
      state.role = '';
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
