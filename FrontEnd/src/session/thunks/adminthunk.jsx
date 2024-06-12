// features/admin/adminThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginadmin, fetchAdminProfile, changePassword } from "../services/adminapi";
import { loginSuccess } from "../authentication";
import { setAdmin } from "../adminslice";
import { fetchNotifications } from "../services/adminapi";
import {setNotifications } from "../notificationSlice"


// Thunk for admin login
export const loginAdminThunk = createAsyncThunk(
  "admin/loginAdmin",
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
  'admin/fetchAdminProfile',
  async (_, { dispatch, getState }) => {
    try {
      // Extract the JWT token from the state
      const jwt = getState().auth.jwt_token;
      console.log(jwt);

      const userProfileData = await fetchAdminProfile(jwt);

      // Dispatch setUser action to update user profile in the store

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
  "admin/changePassword",
  async ({ password, confirmedPassword }, { getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;
    try {
      const response = await changePassword(jwt, password, confirmedPassword );
      return response;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }
);

// Thunk to fetch all notifications 
export const fetchNotificationsThunk = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState, dispatch }) => { // Destructure `dispatch` from the thunk's second argument
    const state = getState();
    const jwt = state.auth.jwt_token;
    try {
      const response = await fetchNotifications(jwt);
      dispatch(setNotifications(response.notifications)); // Dispatch the action to set notifications in the state
      return response; // Return the entire response if needed
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
);