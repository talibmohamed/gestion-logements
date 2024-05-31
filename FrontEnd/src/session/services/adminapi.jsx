// api.js
import axios from 'axios';

const baseURL = "http://localhost/pfe/php/public/index.php/api/v1";

// Function to log in admin
export const loginadmin = async (email, password) => {
  try {
    console.log("calling ")
    const response = await axios.post(`${baseURL}/admin/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in loginadmin:",
      error.response || error.message || error
    );
    throw error;
  }
};
