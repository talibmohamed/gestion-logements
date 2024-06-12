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

// Function to fetch admin profile
export const fetchAdminProfile = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchAdminProfile:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to change password
export const changePassword = async (jwt, password, confirmedPassword) => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/change-password`,
      {
        password,
        confirmedPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in changePassword:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to fetch all notifications

export const fetchNotifications = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/allnotification`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    console.log(response.data)
    return response.data;
  }
  catch (error) {
    console.error(
      "Error in fetchNotifications:",
      error.response || error.message || error
    );
    throw error;
  }
}


