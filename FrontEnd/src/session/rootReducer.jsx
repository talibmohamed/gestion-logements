import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authentication';
import notificationReducer from './notificationSlice';
import userReducer from './userslice';
import adminReducer from './adminslice';
import factureReducer from './factureSlice';
import consumReducer from './consumSlice';
import statisticsReducer from "./statisticsSlice"; 
import logementsReducer from "./logementSlice"
import residantssReducer from "./residantSlice"



const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,
  admin: adminReducer,
  facture: factureReducer,
  statistics: statisticsReducer, 
  logements: logementsReducer,
  residants: residantssReducer,
  consum: consumReducer
});

export const resetStateReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = {
      auth: undefined,
      notifications: undefined,
      user: undefined,
      admin: undefined,
      facture: undefined,
      statistics: undefined, 
      logements: undefined,
      residants: undefined,
      consum: undefined
    };
  }
  return rootReducer(state, action);
};

export default resetStateReducer;
