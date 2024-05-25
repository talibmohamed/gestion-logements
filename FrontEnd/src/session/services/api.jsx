// api.js
import axios from 'axios';

const baseURL = 'http://localhost/pfe/php/public/index.php/api/v1';

// Function to log in admin
export const loginadmin = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/admin/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to log in user
export const loginuser = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/user/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('An error occurred while processing your request');
  }
};

// Function to log in user
export const notification = async () => {
  try {
    const jwtToken = useSelector((state) => state.auth.jwtToken);
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    const response = await axios.get(`${baseURL}${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};
