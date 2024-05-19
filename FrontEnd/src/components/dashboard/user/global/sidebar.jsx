import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "./sidebare.css";
import {
  GridViewRounded as GridViewRoundedIcon,
  ReceiptRounded as ReceiptRoundedIcon,
  BarChartRounded as BarChartRoundedIcon,
  MonetizationOnRounded as MonetizationOnRoundedIcon,
  AccountCircleRounded as AccountCircleRoundedIcon,
  LogoutRounded as LogoutRoundedIcon,
} from "@mui/icons-material";

const SidebarComponent = () => {
  return (
    <Sidebar className="sidebar">
      <Menu>
        <MenuItem
          component={<Link to="/dashboard" />}
          icon={<GridViewRoundedIcon />}
        >
          Overview
        </MenuItem>
        <MenuItem
          component={<Link to="/dashboard/statistics" />}
          icon={<BarChartRoundedIcon />}
        >
          Statistics
        </MenuItem>
        <MenuItem
          component={<Link to="/dashboard/facture" />}
          icon={<ReceiptRoundedIcon />}
        >
          Facture
        </MenuItem>
        <MenuItem
          component={<Link to="/dashboard/reclamation" />}
          icon={<MonetizationOnRoundedIcon />}
        >
          Reclamation
        </MenuItem>
        <MenuItem
          component={<Link to="/dashboard/profile" />}
          icon={<AccountCircleRoundedIcon />}
        >
          Profile
        </MenuItem>
        <MenuItem icon={<LogoutRoundedIcon />}> Logout </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;
