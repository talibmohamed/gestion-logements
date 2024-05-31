import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jwt_token: '',
  role: '',
  first_login: false,  // Set default value
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.jwt_token = action.payload.jwt_token;
      state.role = action.payload.role;
      state.first_login = action.payload.first_login;
      state.isLoggedIn = true;
    },
    updateJwtToken: (state, action) => {
      state.jwt_token = action.payload.jwt_token;
    },
    logout: (state) => {
      state.jwt_token = null;
      state.role = '';
      state.first_login = false;
      state.isLoggedIn = false;
    },
  },
});


export const { loginSuccess, updateJwtToken, logout } = authSlice.actions;

export default authSlice.reducer;
