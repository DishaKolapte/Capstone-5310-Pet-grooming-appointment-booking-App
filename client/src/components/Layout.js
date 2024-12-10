import React, { useState } from "react";
import "../styles/LayoutStyles.css";
import "../styles/FooterStyles.css";
import { adminMenu, userMenu, groomerMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { message } from "antd";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getMenu = () => {
    if (user?.isAdmin) return adminMenu;
    if (user?.isGroomer) return groomerMenu;
    return userMenu;
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const SidebarMenu = getMenu();

  return (
    <>
      <div className="main">
        <button className="menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="layout">
          <div className={`sidebar ${menuOpen ? 'active' : ''}`}>
            <div className="logo">
              <FontAwesomeIcon icon={faPaw} className="logo-icon" />
              <h6>Pet Grooming</h6>
            </div>
            <hr className="divider" />
            <div className="menu">
              {SidebarMenu.map((menu) => (
                <div
                  className={`menu-item ${location.pathname === menu.path && "active"}`}
                  key={menu.name}
                  onClick={() => setMenuOpen(false)}
                >
                  <Link to={menu.path}>
                    <i className={menu.icon}></i>
                    <span>{menu.name}</span>
                  </Link>
                </div>
              ))}
              <div className="menu-item" onClick={handleLogout}>
                <Link to="/login">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="content" onClick={() => menuOpen && setMenuOpen(false)}>
            <div className="header">
              <div className="header-content">
                <div className="user-info">
                  <Link to="/profile" className="user-name">
                    {user?.name}
                  </Link>
                </div>
              </div>
            </div>
            <div className="body">{children}</div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
