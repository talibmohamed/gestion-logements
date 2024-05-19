import React from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./global/topbar";
import Sidebar from "./global/sidebar";
import Overview from "./pages/Overview";
import Statistics from "./pages/Statistics";
import Facture from "./pages/Facture";
import Reclamation from "./pages/Reclamation";
import Profile from "./pages/Profile";
import "./dashboard.scss";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="facture" element={<Facture />} />
            <Route path="reclamation" element={<Reclamation />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
