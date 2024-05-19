import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import "./sidebare.scss";
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
// Removed the map SVG import as it will be replaced by the interactive map
// import map from "./morocco.svg"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

// Fix for missing marker icons in Leaflet
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const SidebarComponent = () => {
  const location = useLocation();
  const position = [32.375289, -6.318726];

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar className="sidebar" backgroundColor="#171821" width="350px">
        <Menu
          menuItemStyles={{
            button: {
              "&:hover": {
                background: "#171821",
                fontWeight: "bold",
                borderLeft: "5px solid #f9769d",
              },
              textAlign: "left",
            },
          }}
        >
          <div className="logo-sidebar">
            <img src={logo} alt="logo" />
            <p className="houselytics-sidebar">Houselytics</p>
          </div>
          <MenuItem
            rootStyles={{
              marginTop: "2vh",
            }}
            component={<Link to="/dashboard" />}
            icon={<HomeRoundedicon />}
            className={
              location.pathname === "/dashboard" ? "active tab" : "tab"
            }
          >
            Overview
          </MenuItem>
          <MenuItem
            rootStyles={{
              marginTop: "2vh",
            }}
            component={<Link to="/dashboard/statistics" />}
            icon={<FaChartPie />}
            className={
              location.pathname === "/dashboard/statistics"
                ? "active tab"
                : "tab"
            }
          >
            Statistics
          </MenuItem>
          <MenuItem
            rootStyles={{
              marginTop: "2vh",
            }}
            component={<Link to="/dashboard/facture" />}
            icon={<FaFileInvoiceDollar />}
            className={
              location.pathname === "/dashboard/facture" ? "active tab" : "tab"
            }
          >
            Facture
          </MenuItem>
          <MenuItem
            rootStyles={{
              marginTop: "2vh",
            }}
            component={<Link to="/dashboard/reclamation" />}
            icon={<Constructionicon />}
            className={
              location.pathname === "/dashboard/reclamation"
                ? "active tab"
                : "tab"
            }
          >
            Reclamation
          </MenuItem>
          <MenuItem
            rootStyles={{
              marginTop: "2vh",
              marginBottom: "auto"
            }}
            component={<Link to="/dashboard/profile" />}
            icon={<Person2icon />}
            className={
              location.pathname === "/dashboard/profile" ? "active tab" : "tab"
            }
          >
            Profile
          </MenuItem>
          <div className="bottom">
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
          <hr className="custom-hr" />
          <MenuItem
            rootStyles={{
              marginTop: "0vh",
            }}
            className="footer-sidebar"
            icon={<HelpOutlineicon />}
          >
            Help & Getting Started
          </MenuItem>
          <MenuItem
            rootStyles={{
                marginTop: "0vh",
            }}
            className="footer-sidebar"
            icon={<Logouticon />}
          >
            Logout
          </MenuItem>
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
