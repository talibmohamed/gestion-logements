// adminapi
import axios from "axios";

const baseURL = "http://localhost/pfe/php/public/index.php/api/v1";

// Function to log in admin
export const loginadmin = async (email, password) => {
  try {
    console.log("calling ");
    const response = await axios.post(`${baseURL}/admin/login`, {
      email,
      password,
    });

    //calling all facture thunk on login and consol log them

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

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchNotifications:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to fetch all facture from /allfacture when passing a jwt
export const fetchFacture = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/facture`, {
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

// Function to fetch statistics
export const fetchStatistics = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/statistics`, {
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

// Function to fetch all logements
export const fetchLogements = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/logement`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchLogements:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to add a logement
export const addLogement = async (jwtToken, logementData) => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/logement`,
      logementData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in addLogement:", error);
    throw error;
  }
};

// Function to update a logement
export const updateLogement = async (jwtToken, logementData) => {
  try {
    const response = await axios.put(
      `${baseURL}/admin/logement`,
      logementData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateLogement:", error);
    throw error;
  }
};

// Function to delete a logement
export const deleteLogement = async (jwtToken, data) => {
  try {
    const response = await axios.delete(`${baseURL}/admin/logement`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      data: data, // Pass data object directly to Axios
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteLogement:", error);
    throw error;
  }
};

// Function to fetch all residants
export const fetchResidants = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/residant`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchResidants:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to add a residant
export const addResidant = async (jwtToken, residantData) => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/residant`,
      residantData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error in addResidant:", error);
    throw error;
  }
};

// Function to update a residant
export const updateResidant = async (jwtToken, residantData) => {
  try {
    const response = await axios.put(
      `${baseURL}/admin/residant`,
      residantData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error in updateResidant:", error);
    throw error;
  }
};

// Function to delete a residant
export const deleteResidant = async (jwtToken, data) => {
  try {
    const response = await axios.delete(`${baseURL}/admin/residant`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      data: data, // Pass data object directly to Axios
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteResidant:", error);
    throw error;
  }
};

// Function to fetch all Factures
export const fetchFactures = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/facture`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchFactures:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to add a Facture
export const addFacture = async (jwtToken, factureData) => {
  try {
    const response = await axios.post(`${baseURL}/admin/facture`, factureData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error in addFacture:", error);
    throw error;
  }
};

// Function to update a Facture
export const updateFacture = async (jwtToken, factureData) => {
  try {
    const response = await axios.put(`${baseURL}/admin/facture`, factureData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error in updateFacture:", error);
    throw error;
  }
};

// Function to delete a Facture
export const deleteFacture = async (jwtToken, data) => {
  try {
    const response = await axios.delete(`${baseURL}/admin/facture`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      data: data, // Pass data object directly to Axios
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteFacture:", error);
    throw error;
  }
};

// Function to send avis
export const sendNotification = async (jwtToken, notificationData) => {
  try {
    const response = await axios.post(
      `${baseURL}/admin/notification`,
      notificationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in sendAvis:", error);
    throw error;
  }
};


export const fetchConsums = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/consommation`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchConsums:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to add a Consum
export const addConsum = async (jwtToken, consumData) => {
  try {
    const response = await axios.post(`${baseURL}/admin/consum`, consumData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error in addConsum:", error);
    throw error;
  }
};

// Function to update a consum
export const updateConsum = async (jwtToken, consumData) => {
  try {
    const response = await axios.put(`${baseURL}/admin/consommation`, consumData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error in updateConsum:", error);
    throw error;
  }
};

//reclamation
// Function to fetch all reclamation
export const fetchReclamations = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/admin/reclamation`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(response);

    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchReclamations:",
      error.response || error.message || error
    );
    throw error;
  }
};

// Function to update a Facture
export const updateReclamation = async (jwtToken, reclamationData) => {
  try {
    const response = await axios.put(
      `${baseURL}/admin/Reclamation`,
      reclamationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error in updateReclamation:", error);
    throw error;
  }
};

// Function to delete a reclamation
export const deleteReclamation = async (jwtToken, data) => {
  try {
    const response = await axios.delete(`${baseURL}/admin/reclamation`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      data: data, // Pass data object directly to Axios
    });
    return response.data;
  } catch (error) {
    console.error("Error in deleteReclamation:", error);
    throw error;
  }
};

//get statisctics grash
export const fetchStatisticsGraph = async (jwt) => {
  try {
    const response = await axios.get(`${baseURL}/user/logement-statistics`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchStatisticsGraph:",
      error.response || error.message || error
    );
    throw error;
  }
};
