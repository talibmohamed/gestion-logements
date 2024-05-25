import axios from 'axios';

const baseURL = 'http://localhost/pfe/php/api/';

export const loginadmin = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}loginadmin.php`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

//user loign 
export const loginuser = async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}login.php`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error('An error occurred while processing your request');
    }
  };
