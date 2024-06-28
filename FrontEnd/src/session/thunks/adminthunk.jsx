// features/admin/adminThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginadmin, fetchAdminProfile, changePassword } from "../services/adminapi";
import { loginSuccess } from "../authentication";
import { setAdmin } from "../adminslice";
import { fetchNotifications } from "../services/adminapi";
import {setNotifications } from "../notificationSlice"
import { fetchFacture } from "../services/adminapi";
import { setFacture } from "../factureSlice";
import { fetchStatistics, fetchLogements, addLogement } from "../services/adminapi";
import { setStatistics, setStatisticsLoading, setStatisticsError } from '../statisticsSlice';
import { setLogements } from "../logementSlice";


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

        // Fetch notifications after successful login
        await dispatch(fetchNotificationsThunk());
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
  async (_, { getState, dispatch }) => { 
    const state = getState();
    const jwt = state.auth.jwt_token;
    try {
      const response = await fetchNotifications(jwt);
      dispatch(setNotifications(response.notifications)); 
      return response; 
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
);

// Thunk to get all facture when passing a jwt 
export const fetchFactureThunk = createAsyncThunk(
  'facture/fetchFacture',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;
    try {
      const response = await fetchFacture(jwt);
      console.log(response);
      dispatch(setFacture(response.factures));
      return response;
    } catch (error) {
      console.error('Error fetching facture:', error);
      throw error;
    }
  }
);

export const fetchStatisticsThunk = createAsyncThunk(
  'statistics/fetchStatistics',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;
    dispatch(setStatisticsLoading()); // Dispatch loading state

    try {
      const response = await fetchStatistics(jwt); // Assuming fetchStatistics is a function that makes an API call
      dispatch(setStatistics(response.statistics)); // Dispatch successful action with parsed data
      return response; // Return response if needed by the caller
    } catch (error) {
      dispatch(setStatisticsError(error.message)); // Dispatch error action with error message
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
);

export const fetchLogementsThunk = createAsyncThunk(
  'logements/fetchLogements',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token; // Assuming auth slice manages JWT token

    try {
      const response = await fetchLogements(jwt); // Call your API function to fetch logements
      dispatch(setLogements(response.logements))
      return response; // Return response if needed by the caller
    } catch (error) {
      console.error('Error fetching logements:', error);
      throw error;
    }
  }
);

// Thunk to add a new logement
export const addLogementThunk = createAsyncThunk(
  'logements/addLogement',
  async (logement, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    try {
      const response = await addLogement(jwt, logement);
      // fetch all logements again to update the state
      dispatch(fetchLogementsThunk());
      return response;
    } catch (error) {
      console.error('Error adding logement:', error);
      throw error;
    }
  }
);