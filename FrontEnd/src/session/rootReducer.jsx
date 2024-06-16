import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authentication';
import notificationReducer from './notificationSlice';
import userReducer from './userslice';
import adminReducer from './adminslice';
import factureReducer from './factureSlice' 

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,
  admin: adminReducer, 
  facture: factureReducer


});

export const resetStateReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = {
      auth: undefined,
      notifications: undefined,
      user: undefined,
      admin: undefined, 
      facture: undefined
    };
  }
  return rootReducer(state, action);
};

export default resetStateReducer;
