import React, { useState, useEffect } from "react";
import { GrTable, GrSystem, GrUserSettings, GrGroup, GrGlobe, GrContactInfo, GrMonitor, GrOrganization, GrShieldSecurity, GrMultiple, GrFolder, GrSearch, GrArticle, GrBusinessService } from "react-icons/gr";
import "../styles/SideNavBar.css";
import axios from "axios";
import styled from "styled-components";

const Banderas = styled.img`
  width: 20px;
  height: 20px;
`;

const SideNavBar = () => {
  const [isExpanded, setExpandState] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [paises, setPaises] = useState([]);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pais/`);
        setPaises(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de paises', error);
      }
    };
    fetchPaises();
  }, []);

  const menuItems = [
    {
      title: "Matriz de Perfiles",
      icon: <GrTable />,
      subNav: paises.map(pais => ({
        title: pais.N_Pais,
        icon: <Banderas src={require(`../imgs/${pais.N_Pais.toLowerCase()}.png`)} alt={`Bandera de ${pais.N_Pais}`} />, // Icono de bandera
        path: `/matrizPais?pais=${encodeURIComponent(pais.N_Pais)}`
      }))
    },
    // Otros ítems del menú...
  ];

  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const expandSidebar = () => {
    setExpandState(true);
  };

  const collapseSidebar = () => {
    setExpandState(false);
  };

  return (
    <div
      className={isExpanded ? "side-nav-container" : "side-nav-container side-nav-container-NX"}
      onMouseEnter={expandSidebar}
      onMouseLeave={collapseSidebar}
    >
      <div className="nav-upper">
        <div className="nav-menu">
          {menuItems.map((menuItem, index) => (
            <div key={index}>
              <button
                className={isExpanded ? "menu-item" : "menu-item menu-item-NX"}
                onClick={() => toggleSubMenu(index)}
              >
                <div className="menu-item-icon">{menuItem.icon}</div>
                {isExpanded && <p>{menuItem.title}</p>}
              </button>
              {isExpanded && activeMenu === index && menuItem.subNav && (
                <div className="sub-menu">
                  {menuItem.subNav.map((subItem, subIndex) => (
                    <a
                      href={subItem.path}
                      className="sub-menu-item"
                      key={subIndex}
                    >
                      <div className="sub-menu-item-icon">{subItem.icon}</div>
                      <p>{subItem.title}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="nav-footer">
        {isExpanded && (
          <div className="nav-details">
            <div className="nav-footer-info">
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNavBar;