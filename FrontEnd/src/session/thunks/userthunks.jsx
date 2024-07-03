// userThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginuser,
  fetchUserProfile,
  changePassword,
  checkToken,
} from "../services/userapi";
import { setUser } from "../userslice";
import { loginSuccess, updateJwtToken } from "../authentication";
import {
  setStatistics,
  setStatisticsError,
  setStatisticsLoading,
} from "../statisticsSlice";
import { fetchStatistics, fetchFacture } from "../services/userapi";
import { setFacture } from "../factureSlice";
import { fetchReclamation, annulerReclamation } from "../services/userapi";
import { setReclamations } from "../reclamationSlice";

// Thunk to handle user login
export const loginUserThunk = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { dispatch }) => {
    try {
      // Call the API function to log in the user
      const userData = await loginuser(email, password);

      if (userData.status === "success") {
        // Dispatch loginSuccess action if login is successful
        console.log(userData);
        dispatch(loginSuccess(userData));

        // Extract JWT token from user data
        const jwt = userData.jwt_token;
        console.log(jwt);

        // Fetch user profile data using the JWT token
        dispatch(fetchUserProfileThunk(jwt));
      }
      return userData;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
);

// Thunk to fetch user profile data
export const fetchUserProfileThunk = createAsyncThunk(
  "user/fetchUserProfile",
  async (jwt, { dispatch }) => {
    try {
      // Call the API function to fetch user profile using JWT token

      const userProfileData = await fetchUserProfile(jwt);

      // Dispatch setUser action to update user profile in the store

      dispatch(setUser(userProfileData.user));
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
      const response = await changePassword(password, confirmedPassword, jwt);
      return response;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }
);


// Thunk to check token

export const checkTokenThunk = createAsyncThunk(
  "user/checkToken",
  async (token, { dispatch }) => {
    try {
      // Call the API function to check the token
      const response = await checkToken(token);

      // Extract the new JWT token from the response
      const newToken = response.jwt_token;

      // Dispatch setUser action to update user profile in the store
      dispatch(setUser(response.user));

      // Dispatch updateJwtToken action to update the JWT token in the store
      dispatch(updateJwtToken({ jwt_token: newToken }));

      return response;
    } catch (error) {
      console.error("Error checking token:", error);
      throw error;
    }
  }
);

//statistics

export const fetchStatisticsThunk = createAsyncThunk(
  "user/fetchStatistics",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;
    console.log(jwt);

    try {
      const response = await fetchStatistics(jwt); // Assuming fetchStatistics is a function that makes an API call
      dispatch(setStatistics(response.statistics)); // Dispatch successful action with parsed data
      return response; // Return response if needed by the caller
    } catch (error) {
      dispatch(setStatisticsError(error.message)); // Dispatch error action with error message
      console.error("Error fetching statistics:", error);
      throw error;
    }
  }
);

// Thunk to fetch facture
export const fetchFactureThunk = createAsyncThunk(
  "user/fetchFacture",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;
    console.log(jwt);

    try {
      const response = await fetchFacture(jwt); // Assuming fetchFacture is a function that makes an API call
      dispatch(setFacture(response.factures)); // Dispatch successful action with parsed data
      return response;
    } catch (error) {
      console.error("Error checking token:", error);
      throw error;
    }
  }
);

//fetch reclamation
export const fetchReclamationThunk = createAsyncThunk(
  "user/fetchReclamation",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;
    console.log(jwt);

    try {
      const response = await fetchReclamation(jwt); 
      dispatch(setReclamations(response.reclamations)); 
      return response;
    } catch (error) {
      console.error("Error fetching reclamation:", error);
      throw error;
    }
  }
);

export const annulerReclamationThunk = createAsyncThunk(
  "user/annulerReclamation",
  async (data, { getState, dispatch }) => {
    try {
      const state = getState();
      const jwt = state.auth.jwt_token;

      const response = await annulerReclamation(data, jwt); 
      // fetch fetchReclamationThunk to update 
      dispatch(fetchReclamationThunk());
      return response; 
    } catch (error) {
      console.error("Error annuler reclamation:", error);
      throw error;
    }
  }
);
