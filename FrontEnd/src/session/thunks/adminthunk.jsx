// features/admin/adminThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginadmin,
  fetchAdminProfile,
  changePassword,
} from "../services/adminapi";
import { loginSuccess } from "../authentication";
import { setAdmin } from "../adminslice";
import { fetchNotifications } from "../services/adminapi";
import { setNotifications } from "../notificationSlice";
import { fetchFacture } from "../services/adminapi";
import { setFacture } from "../factureSlice";
import {
  fetchStatistics,
  fetchLogements,
  addLogement,
  updateLogement,
  deleteLogement,
} from "../services/adminapi";
import {
  fetchResidants,
  addResidant,
  updateResidant,
  deleteResidant,
} from "../services/adminapi";
import {
  fetchFactures,
  addFacture,
  updateFacture,
  deleteFacture,
} from "../services/adminapi";
import { sendNotification } from "../services/adminapi";
import {
  setStatistics,
  setStatisticsLoading,
  setStatisticsError,
} from "../statisticsSlice";

import { setLogements } from "../logementSlice";
import { setResidants } from "../residantSlice.jsx";
import { setConsums } from "../consumSlice.jsx";

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
  "admin/fetchAdminProfile",
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
      console.error("Error fetching user profile:", error);
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
      const response = await changePassword(jwt, password, confirmedPassword);
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
  "facture/fetchFacture",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;
    try {
      const response = await fetchFacture(jwt);
      console.log(response);

      dispatch(setFacture(response.factures));
      return response;
    } catch (error) {
      console.error("Error fetching facture:", error);
      throw error;
    }
  }
);

export const fetchStatisticsThunk = createAsyncThunk(
  "statistics/fetchStatistics",
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
      console.error("Error fetching statistics:", error);
      throw error;
    }
  }
);

export const fetchLogementsThunk = createAsyncThunk(
  "logements/fetchLogements",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token; // Assuming auth slice manages JWT token

    try {
      const response = await fetchLogements(jwt); // Call your API function to fetch logements
      dispatch(setLogements(response.logements));
      return response; // Return response if needed by the caller
    } catch (error) {
      console.error("Error fetching logements:", error);
      throw error;
    }
  }
);

// Thunk to add a new logement
export const addLogementThunk = createAsyncThunk(
  "logements/addLogement",
  async (logement, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    try {
      const response = await addLogement(jwt, logement);
      // fetch all logements again to update the state
      dispatch(fetchLogementsThunk());
      return response;
    } catch (error) {
      console.error("Error adding logement:", error);
      throw error;
    }
  }
);

// Thunk to update an existing logement
export const updateLogementThunk = createAsyncThunk(
  "logements/updateLogement",
  async (logement, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    try {
      const response = await updateLogement(jwt, logement);
      // Fetch all logements again to update the state
      dispatch(fetchLogementsThunk());
      return response;
    } catch (error) {
      console.error("Error updating logement:", error);
      throw error;
    }
  }
);

// Thunk to delete a logement
export const deleteLogementThunk = createAsyncThunk(
  "logements/deleteLogement",
  async (data, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    console.log(jwt);

    try {
      const response = await deleteLogement(jwt, data);
      // Fetch all logements again to update the state
      dispatch(fetchLogementsThunk());
      console.log(response);
      return response; // Ensure to return the response from deleteLogement
    } catch (error) {
      console.error("Error deleting logement:", error);
      throw error;
    }
  }
);

export const fetchResidantsThunk = createAsyncThunk(
  "residants/fetchResidants",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token; // Assuming auth slice manages JWT token

    try {
      const response = await fetchResidants(jwt);
      dispatch(setResidants(response.residants));
      return response; // Return response if needed by the caller
    } catch (error) {
      console.error("Error fetching residants:", error);
      throw error;
    }
  }
);

// Thunk to add a new residant
export const addResidantThunk = createAsyncThunk(
  "residants/addResidant",
  async (residant, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    try {
      const response = await addResidant(jwt, residant);
      console.log(response);

      // fetch all residants again to update the state
      dispatch(fetchResidantsThunk());
      return response;
    } catch (error) {
      console.error("Error adding residant:", error);
      throw error;
    }
  }
);

// Thunk to update an existing residant
export const updateResidantThunk = createAsyncThunk(
  "residants/updateResidant",
  async (residant, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    try {
      const response = await updateResidant(jwt, residant);
      console.log(response);
      // Fetch all residants again to update the state
      dispatch(fetchResidantsThunk());
      return response;
    } catch (error) {
      console.error("Error updating residant:", error);
      throw error;
    }
  }
);

// Thunk to delete a residant
export const deleteResidantThunk = createAsyncThunk(
  "residants/deleteResidant",
  async (data, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    console.log(jwt);

    try {
      const response = await deleteResidant(jwt, data);
      // Fetch all residants again to update the state
      dispatch(fetchResidantsThunk());
      console.log(response);
      return response; // Ensure to return the response from deleteresidant
    } catch (error) {
      console.error("Error deleting residant:", error);
      throw error;
    }
  }
);

export const fetchFacturesThunk = createAsyncThunk(
  "factures/fetchFactures",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const jwt = state.auth.jwt_token; // Assuming auth slice manages JWT token

    try {
      const response = await fetchFactures(jwt); // Call your API function to fetch factures
      dispatch(setFacture(response.factures));
      return response; // Return response if needed by the caller
    } catch (error) {
      console.error("Error fetching factures:", error);
      throw error;
    }
  }
);

// Thunk to add a new facture
export const addFactureThunk = createAsyncThunk(
  "factures/addFacture",
  async (facture, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    try {
      const response = await addFacture(jwt, facture);
      console.log(response);

      // fetch all factures again to update the state
      dispatch(fetchFacturesThunk());
      return response;
    } catch (error) {
      console.error("Error adding facture:", error);
      throw error;
    }
  }
);

// Thunk to update an existing facture
export const updateFactureThunk = createAsyncThunk(
  "factures/updateFacture",
  async (facture, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    try {
      const response = await updateFacture(jwt, facture);
      console.log(response);
      // Fetch all factures again to update the state
      dispatch(fetchFacturesThunk());
      return response;
    } catch (error) {
      console.error("Error updating facture:", error);
      throw error;
    }
  }
);

// Thunk to delete a facture
export const deleteFactureThunk = createAsyncThunk(
  "factures/deleteFacture",
  async (data, { getState, dispatch }) => {
    const state = getState();
    const jwt = state.auth.jwt_token;

    console.log(jwt);

    try {
      const response = await deleteFacture(jwt, data);
      // Fetch all factures again to update the state
      dispatch(fetchFacturesThunk());
      console.log(response);
      return response; // Ensure to return the response from deletefacture
    } catch (error) {
      console.error("Error deleting facture:", error);
      throw error;
    }
  }
);

