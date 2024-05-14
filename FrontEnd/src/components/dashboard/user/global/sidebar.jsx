import React from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  HomeOutlined as HomeOutlinedIcon,
  PeopleOutlined as PeopleOutlinedIcon,
  ContactsOutlined as ContactsOutlinedIcon,
  ReceiptOutlined as ReceiptOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  HelpOutlineOutlined as HelpOutlineOutlinedIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  PieChartOutlineOutlined as PieChartOutlineOutlinedIcon,
  TimelineOutlined as TimelineOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
  MapOutlined as MapOutlinedIcon,
} from "@mui/icons-material";

const Sidebar = () => {
  return (
    <ProSidebar>
      <Menu
        iconShape="circle"
        styles={{
          backgroundColor: "#263238",
          marginTop: "65px", // Adjust this value as needed
        }}
      >
        <MenuItem icon={<HomeOutlinedIcon />}>
          <Link to="/">Home</Link>
        </MenuItem>
        <MenuItem icon={<PeopleOutlinedIcon />}>
          <Link to="/people">People</Link>
        </MenuItem>
        <MenuItem icon={<ContactsOutlinedIcon />}>
          <Link to="/contacts">Contacts</Link>
        </MenuItem>
        <MenuItem icon={<ReceiptOutlinedIcon />}>
          <Link to="/receipts">Receipts</Link>
        </MenuItem>
        <MenuItem icon={<PersonOutlinedIcon />}>
          <Link to="/profile">Profile</Link>
        </MenuItem>
        <MenuItem icon={<CalendarTodayOutlinedIcon />}>
          <Link to="/calendar">Calendar</Link>
        </MenuItem>
        <MenuItem icon={<HelpOutlineOutlinedIcon />}>
          <Link to="/help">Help</Link>
        </MenuItem>
        <MenuItem icon={<BarChartOutlinedIcon />}>
          <Link to="/charts">Charts</Link>
        </MenuItem>
        <MenuItem icon={<PieChartOutlineOutlinedIcon />}>
          <Link to="/piecharts">Pie Charts</Link>
        </MenuItem>
        <MenuItem icon={<TimelineOutlinedIcon />}>
          <Link to="/timeline">Timeline</Link>
        </MenuItem>
        <MenuItem icon={<MenuOutlinedIcon />}>
          <Link to="/menu">Menu</Link>
        </MenuItem>
        <MenuItem icon={<MapOutlinedIcon />}>
          <Link to="/map">Map</Link>
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
