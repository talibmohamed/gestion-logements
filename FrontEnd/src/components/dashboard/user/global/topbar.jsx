import React from "react";
import MenuIcon from '@mui/icons-material/Menu'; // Correct import for the MenuIcon
import "./topbar.scss";
import { FaUserCircle } from "react-icons/fa";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import { Menu } from "react-pro-sidebar";
import {Avatar} from "@nextui-org/react";

const Topbar = ({ broken, toggled, setToggled }) => {
  return (
    <div className="topbar">
      {broken && (
        <button className="sb-button" onClick={() => setToggled(!toggled)}>
          <MenuIcon />
        </button>
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
              <MailOutlineOutlinedIcon style={{ fontSize: 28, }} />
            </IconButton>
            {/* NEXTUI */}
            <div className="items-center ">
              {/* <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                  icon: "text-black/80",
                }}
              /> */}
                      <Avatar isBordered color="secondary" name="Joe" />   
            </div>
            {/* <FaUserCircle className="user-icon" /> */}
            <p className="user-name">John Doe</p>
          </div>
        </Menu>
      </div>
    </div>
  );
};

export default Topbar;
