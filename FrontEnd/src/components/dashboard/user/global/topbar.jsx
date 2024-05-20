import React from "react";
import MenuIcon from '@mui/icons-material/Menu'; // Correct import for the MenuIcon
import "./topbar.scss";

const Topbar = ({ broken, toggled, setToggled }) => {
  return (
    <div className="topbar">
      {broken && (
        <button className="sb-button" onClick={() => setToggled(!toggled)}>
          <MenuIcon />
        </button>
      )}
    </div>
  );
};

export default Topbar;
