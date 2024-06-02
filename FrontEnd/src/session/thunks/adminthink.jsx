// features/admin/adminThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginadmin } from "../services/adminapi";
import { loginSuccess } from "../authentication";


// Thunk for admin login
export const loginAdminThunk = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { dispatch }) => {
    try {
      // Call the API function to log in the user
      const userData = await loginadmin(email, password);

      if (userData.status === "success") {
        // Dispatch loginSuccess action if login is successful
        dispatch(loginSuccess(userData));
      }
      return userData;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
);
