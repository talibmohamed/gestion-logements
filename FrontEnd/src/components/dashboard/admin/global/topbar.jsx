import React from "react";
import MenuIcon from "@mui/icons-material/Menu"; // Correct import for the MenuIcon
import "./topbar.scss";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import { Menu } from "react-pro-sidebar";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "./logo.svg";
import Notification from "./notifcation"

const Topbar = ({ broken, toggled, setToggled }) => {
  return (
    <div className="topbar">
      {broken && (
        <div className=" top-bar-phone flex justify-between items-center">
          <div className="flex align-items-center gap-3 ">
            {/* resize the img */}
            <img src={logo} alt="logo" className="top-logo"  />
            <p>Houselytics</p>
          </div>
          <div>
            <button onClick={() => setToggled(!toggled)} className="humb-button">
              <GiHamburgerMenu />
            </button>
          </div>
        </div>
      )}
      <div className="nav justify-content-end">
        <Menu
          menuItemStyles={{
            button: {
              textAlign: "left",
              border: "0px",
            },
          }}
        >
          <div className="user-section">
            <IconButton className="mail-icon">
              <MailOutlineOutlinedIcon style={{ fontSize: 28 }} />
            </IconButton>
            <Notification />
            <div className="user-avatar">
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#737dfe] to-[#ffcac9]",
                  icon: "text-black/80",
                }}
              />
            </div>
            <p className="user-nameuser">admin name</p>
          </div>
        </Menu>
      </div>
    </div>
  );
};

export default Topbar;
