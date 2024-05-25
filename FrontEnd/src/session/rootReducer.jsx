// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authentication';
import notificationReducer from './notificationSlice'; // Import the notification reducer

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer, // Add the notification reducer to the root reducer
});

// Define a root reducer function that resets the state of all slices to their initial states, including notifications
export const resetStateReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = {
      auth: undefined,
      notifications: undefined, // Reset the notifications state to undefined upon logout
    }; 
  }
  return rootReducer(state, action);
};

export default resetStateReducer;
