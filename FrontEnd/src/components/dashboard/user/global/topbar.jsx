import React from "react";
import MenuIcon from '@mui/icons-material/Menu'; // Correct import for the MenuIcon
import "./topbar.scss";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import { Menu } from "react-pro-sidebar";
import { Avatar, AvatarIcon } from "@nextui-org/react";

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
            <Avatar
              icon={<AvatarIcon />}
              classNames={{
                base: "bg-gradient-to-br from-[#737dfe] to-[#ffcac9]",
                icon: "text-black/80",
              }}
            />
            <p className="user-name">John Doe</p>
          </div>
        </Menu>
      </div>
    </div>
  );
};

export default Topbar;