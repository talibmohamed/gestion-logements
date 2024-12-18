import React from "react";
import MenuIcon from "@mui/icons-material/Menu"; // Correct import for the MenuIcon
import "./topbar.scss";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import { Menu } from "react-pro-sidebar";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "./logo.svg";
import Notification from "./notifcation";
import { useSelector } from "react-redux";

const Topbar = ({ broken, toggled, setToggled }) => {
  // getting first_login from redux
  // const first_login = useSelector((state) => state.auth.first_login);

  const nom = useSelector((state) => state.user.nom);
  const prenom = useSelector((state) => state.user.prenom);

  console.log("nom", nom, "prenom", prenom);

  return (
    <div className="topbar">
      {broken && (
        <div className=" top-bar-phone flex justify-between items-center">
          <div className="flex items-center gap-3 ">
            {/* resize the img */}
            <img src={logo} alt="logo" className="top-logo" />
            <p>Houselytics</p>
          </div>

          <div className="notif-mobile">
            <Notification />
            <button
              onClick={() => setToggled(!toggled)}
              className="pl-5 humb-button"
            >
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
            <p className="user-nameuser">
              {nom} {prenom}
            </p>
          </div>
        </Menu>
      </div>
    </div>
  );
};

export default Topbar;
