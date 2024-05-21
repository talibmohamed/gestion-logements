import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./topbar.scss";
import { Avatar, AvatarIcon } from "@nextui-org/react";

const Topbar = ({ broken, toggled, setToggled }) => {
  return (
    <div className="topbar">
      {broken && (
        <button className="sb-button" onClick={() => setToggled(!toggled)}>
          <MenuIcon />
        </button>
      )}
      <Avatar
        icon={<AvatarIcon />}
        classNames={{
          base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
          icon: "text-black/80",
        }}
      />
    </div>
  );
};

export default Topbar;
