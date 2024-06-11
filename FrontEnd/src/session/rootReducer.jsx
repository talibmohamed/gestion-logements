import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authentication';
import notificationReducer from './notificationSlice';
import userReducer from './userslice';
import adminReducer from './adminslice'; 

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,
  admin: adminReducer, 
});

export const resetStateReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = {
      auth: undefined,
      notifications: undefined,
      user: undefined,
      admin: undefined, 
    };
  }
  return rootReducer(state, action);
};

export default resetStateReducer;
