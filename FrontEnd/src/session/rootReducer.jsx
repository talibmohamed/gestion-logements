import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authentication';

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here...
});

// Define a root reducer function that resets the state of all slices to their initial states
//aka logout
export const resetStateReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = undefined; 
  }
  return rootReducer(state, action);
};

export default resetStateReducer;
