// features/admin/adminThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginadmin, fetchAdminProfile } from "../services/adminapi";
import { loginSuccess } from "../authentication";
import { setAdmin } from "../adminslice";

// Thunk for admin login
export const loginAdminThunk = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { dispatch }) => {
    try {
      // Call the API function to log in the user
      const userData = await loginadmin(email, password);

      if (userData.status === "success") {
        // Dispatch loginSuccess action if login is successful
        dispatch(loginSuccess(userData));
      }
      return userData;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
);

// Thunk to fetch admin profile data where the jwt in in the authentication slice
export const fetchAdminProfileThunk = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { dispatch, getState }) => {
    try {
      // Extract the JWT token from the state
      const jwt = getState().auth.jwt_token;
      console.log(jwt);

      const userProfileData = await fetchAdminProfile(jwt);

      // Dispatch setUser action to update user profile in the store
      console.log(userProfileData.admin);

      dispatch(setAdmin(userProfileData.admin));

      // display the admin state 
      console.log(getState().admin);

    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
);

// Thunk to handle change passwrod
export const changePasswordThunk = createAsyncThunk(
  "user/changePassword",
  async ({ password, confirmedPassword }, { getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;
    console.log(jwt);
    try {
      const response = await changePassword(jwt, password, confirmedPassword );
      return response;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }
);