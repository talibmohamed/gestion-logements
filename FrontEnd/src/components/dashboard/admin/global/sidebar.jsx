import React from "react";
import { useDispatch } from "react-redux";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../../session/authentication";
import "./sidebare.scss";
import { ArrowBack, Margin } from "@mui/icons-material";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
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

const SidebarComponent = ({ toggled, setToggled, setBroken }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Define navigate function
  const nom = useSelector((state) => state.admin.nom);
  const prenom = useSelector((state) => state.admin.prenom);
  const dispatch = useDispatch();

  // logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("state");
    navigate("/admin");
  };

  React.useEffect(() => {
    const handleResize = () =>
      setBroken(window.matchMedia("(max-width: 1000px)").matches);
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
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Sidebar
        className={`sidebar ${toggled ? "toggled" : ""}`}
        backgroundColor="#171821"
        width={toggled ? "90%" : "20vw"}
        border="0px solid #171821"
        toggled={toggled}
        customBreakPoint="1000px"
        onBreakPoint={setBroken}
      >
        <Menu
          menuItemStyles={{
            button: {
              "&:hover": {
                background: "#171821",
                fontWeight: "semibold",
                borderLeft: "5px solid #f9769d",
              },
              textAlign: "left",
              border: "0px",
              // marginTop: "3px",
              paddingLeft: "30px"
            },
          }}
        >
          {toggled && (
            <div>
              <div className="sb-top flex justify-between items-center m-4">
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
          <div className="bigmenu">
            <div className="menu">
              <MenuItem
                component={<Link to="/dashboard" />}
                icon={<HomeRoundedicon className="house-icon"/>}
                className={
                  location.pathname === "/dashboard" ? "active tab" : "tab"
                }
                onClick={handleMenuItemClick}
              >
                Accueil
              </MenuItem>
              <MenuItem
                component={<Link to="/dashboard/logement" />}
                icon={<FaChartPie className="pie-icon"/>}
                className={
                  location.pathname === "/dashboard/logement"
                    ? "active tab"
                    : "tab"
                }
                onClick={handleMenuItemClick}
              >
                Logement
              </MenuItem>
              <MenuItem
                component={<Link to="/dashboard/facture" />}
                icon={<FaFileInvoiceDollar className="file-icon"/>}
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
                icon={<Constructionicon className="tools-icon"/>}
                className={
                  location.pathname === "/dashboard/reclamation"
                    ? "active tab"
                    : "tab"
                }
                onClick={handleMenuItemClick}
              >
                Réclamation
              </MenuItem>
              <MenuItem
                component={<Link to="/dashboard/profile" />}
                icon={<Person2icon className="ppl-icon"/>}
                className={
                  location.pathname === "/dashboard/profile"
                    ? "active tab"
                    : "tab"
                }
                onClick={handleMenuItemClick}
              >
                Profil
              </MenuItem>
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
                  Aide & Premiers Pas
                </MenuItem>
                <MenuItem
                  className="footer-sidebar"
                  icon={<Logouticon />}
                  onClick={handleLogout}
                >
                  Déconnexion
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
