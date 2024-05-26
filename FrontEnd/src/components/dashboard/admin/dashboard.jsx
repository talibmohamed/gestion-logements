// AdminDashboard component
import React from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./global/topbar";
import SidebarComponent from "./global/sidebar"; 
import Overview from "./pages/Overview";
import Statistics from "./pages/Statistics";
import Facture from "./pages/Facture";
import Reclamation from "./pages/Reclamation";
import Profile from "./pages/Profile";
import "./dashboard.scss";

const AdminDashboard = () => {
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(
    window.matchMedia("(max-width: 9000px)").matches
  );

  React.useEffect(() => {
    const handleResize = () =>
      setBroken(window.matchMedia("(max-width: 1000px)").matches);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="dashboard-container">
      <SidebarComponent
        toggled={toggled}
        setToggled={setToggled}
        setBroken={setBroken}
      />
      <div className="main-content">
        <Topbar broken={broken} toggled={toggled} setToggled={setToggled} />
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

export default AdminDashboard;
