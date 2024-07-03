// api.js
import axios from "axios";
import { useSelector } from "react-redux";

const baseURL = "http://localhost/pfe/php/public/index.php/api/v1";

export const loginuser = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/user/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("An error occurred while processing your request");
  }
};

// Function fetch user profile

export const fetchUserProfile = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//change password
export const changePassword = async (password, confirmedPassword, jwt) => {
  try {
    const response = await axios.post(
      `${baseURL}/user/change-password`,
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
    console.error(error);
    throw error;
  }
};

//check token sent in the header
export const checkToken = async (token) => {
  try {
    const response = await axios.post(
      `${baseURL}/user/check-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("3");
    console.log(response.data);
    console.log("3");

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to fetch statistics
export const fetchStatistics = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/user/statistics`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchStatistics:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to fetch facture
export const fetchFacture = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/user/facture`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchFacture:",
      error.response || error.message || error
    );
    throw error;
  }
};

//fetch reclamation
export const fetchReclamation = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/user/reclamation`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchReclamation:",
      error.response || error.message || error
    );
    throw error;
  }
};

export const annulerReclamation = async (data, jwtToken) => {
  try {
    console.log('data');
    const response = await axios.put(
      `${baseURL}/user/reclamation`,
      data, // Pass data as the second argument
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in annulerReclamation:", error.message);
    throw error;
  }
};
