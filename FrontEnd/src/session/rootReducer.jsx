// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authentication';
import notificationReducer from './notificationSlice'; // Import the notification reducer
import userReducer from './userslice'; 

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer, // Add the notification reducer to the root reducer
  user: userReducer,
});

// Define a root reducer function that resets the state of all slices to their initial states
export const resetStateReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = {
      auth: undefined,
      notifications: undefined, 
      user: undefined,
    }; 
  }
  return rootReducer(state, action);
};

export default resetStateReducer;
