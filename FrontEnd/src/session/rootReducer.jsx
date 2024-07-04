import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authentication";
import notificationReducer from "./notificationSlice";
import userReducer from "./userslice";
import adminReducer from "./adminslice";
import factureReducer from "./factureSlice";
import consumReducer from "./consumSlice";
import statisticsReducer from "./statisticsSlice";
import logementsReducer from "./logementSlice";
import residantsReducer from "./residantSlice";
import reclamationReducer from "./reclamationSlice";
import graphReducer from "./graphSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,
  admin: adminReducer,
  facture: factureReducer,
  statistics: statisticsReducer,
  logements: logementsReducer,
  residants: residantsReducer,
  consum: consumReducer,
  reclamation: reclamationReducer,
  graph: graphReducer,
});

export const resetStateReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = {
      auth: undefined,
      notifications: undefined,
      user: undefined,
      admin: undefined,
      facture: undefined,
      statistics: undefined,
      logements: undefined,
      residants: undefined,
      consum: undefined,
      reclamation: undefined,
      graph: undefined,
    };
  }
  return rootReducer(state, action);
};

export default resetStateReducer;
