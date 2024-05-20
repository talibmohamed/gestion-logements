import React from "react";
import { useDispatch } from "react-redux"; 
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { logout } from "../../../../session/authentication"; 
import "./sidebare.scss";
import { ArrowBack } from "@mui/icons-material";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";

import {
  HomeRounded as HomeRoundedicon,
  Construction as Constructionicon,
  Person2 as Person2icon,
  HelpOutline as HelpOutlineicon,
  Logout as Logouticon,
} from "@mui/icons-material";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaChartPie } from "react-icons/fa";
import logo from "./logo.svg";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const SidebarComponent = ({ toggled, setToggled, setBroken }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Define navigate function
  const nom = useSelector((state) => state.auth.nom);
  const prenom = useSelector((state) => state.auth.prenom);
  const dispatch = useDispatch();

  const position = [32.375289, -6.318726];

  // logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("state"); 
    navigate("/user"); // Redirect to '/user' after logout
  };

  React.useEffect(() => {
    const handleResize = () =>
      setBroken(window.matchMedia("(max-width: 800px)").matches);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setBroken]);

  const handleMenuItemClick = () => {
    if (toggled) {
      setToggled(false);
    }
  };

  const handleToggleSidebar = () => {
    setToggled(!toggled);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar
        className={`sidebar ${toggled ? "toggled" : ""}`}
        backgroundColor="#171821"
        width={toggled ? "90%" : "20vw"}
        border="0px solid #171821"
        toggled={toggled}
        customBreakPoint="800px"
        onBreakPoint={setBroken}
      >
        <Menu
          menuItemStyles={{
            button: {
              "&:hover": {
                background: "#171821",
                fontWeight: "bold",
                borderLeft: "5px solid #f9769d",
              },
              textAlign: "left",
              border: "0px",
            },
          }}
        >
          {toggled && (
            <div>
              <div className="sb-top d-flex justify-content-between align-items-center">
                <div className="back-button-container">
                  <button className="back-button" onClick={handleToggleSidebar}>
                    <ArrowBack />
                  </button>
                </div>
                <button className="sm-logout" onClick={handleLogout}>
                  Logout <Logouticon />
                </button>
              </div>
              <div className="user-info">
                <FaUserCircle className="user-icon" />
                <p className="user-name">
                  {nom} {prenom}
                </p>
              </div>
            </div>
          )}
          <div className="logo-sidebar">
            <img src={logo} alt="logo" />
            <p className="houselytics-sidebar">Houselytics</p>
          </div>
          <div className="menu">
            <MenuItem
              component={<Link to="/dashboard" />}
              icon={<HomeRoundedicon />}
              className={
                location.pathname === "/dashboard" ? "active tab" : "tab"
              }
              onClick={handleMenuItemClick}
            >
              Overview
            </MenuItem>
            <MenuItem
              component={<Link to="/dashboard/statistics" />}
              icon={<FaChartPie />}
              className={
                location.pathname === "/dashboard/statistics"
                  ? "active tab"
                  : "tab"
              }
              onClick={handleMenuItemClick}
            >
              Statistics
            </MenuItem>
            <MenuItem
              component={<Link to="/dashboard/facture" />}
              icon={<FaFileInvoiceDollar />}
              className={
                location.pathname === "/dashboard/facture"
                  ? "active tab"
                  : "tab"
              }
              onClick={handleMenuItemClick}
            >
              Facture
            </MenuItem>
            <MenuItem
              component={<Link to="/dashboard/reclamation" />}
              icon={<Constructionicon />}
              className={
                location.pathname === "/dashboard/reclamation"
                  ? "active tab"
                  : "tab"
              }
              onClick={handleMenuItemClick}
            >
              Reclamation
            </MenuItem>
            <MenuItem
              component={<Link to="/dashboard/profile" />}
              icon={<Person2icon />}
              className={
                location.pathname === "/dashboard/profile"
                  ? "active tab"
                  : "tab"
              }
              onClick={handleMenuItemClick}
            >
              Profile
            </MenuItem>
            <div className="map-sidebar">
              <MapContainer
                center={position}
                zoom={15}
                style={{ height: "300px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}></Marker>
              </MapContainer>
            </div>
          </div>
          <div className="bottom">
            {!toggled && (
              <div>
                <hr className="custom-hr" />
                <MenuItem
                  rootStyles={{
                    size: "10px",
                  }}
                  className="footer-sidebar"
                  icon={<HelpOutlineicon />}
                  onClick={handleMenuItemClick}
                >
                  Help & Getting Started
                </MenuItem>
                <MenuItem
                  className="footer-sidebar"
                  icon={<Logouticon />}
                  onClick={handleLogout}
                >
                  Logout
                </MenuItem>
              </div>
            )}
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
