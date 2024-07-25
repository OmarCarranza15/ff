
import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import {
  GrTable,
  GrSystem,
  GrUserSettings,
  GrGroup,
  GrGlobe,
  GrBusinessService,
  GrContactInfo,
  GrMonitor,
  GrOrganization,
  GrShieldSecurity,
  GrMultiple,
  GrFolder,
  GrSearch,
  GrDocumentDownload,
} from "react-icons/gr";
import { LiaUserTieSolid } from "react-icons/lia";
import styled from "styled-components";
import "../styles/SideNavBar.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Banderas = styled.img`
  width: 20px;
  height: 20px;
`;

const secretKey = 'mySecretKey'; // Clave secreta para encriptar datos

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const SideNavBar = () => {
  const [isExpanded, setExpandState] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [paises, setPaises] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userCountries, setUserCountries] = useState([]);

  useEffect(() => {
    // Leer el rol del usuario desde sessionStorage y desencriptar
    const encryptedRole = sessionStorage.getItem('userRole');
    if (encryptedRole) {
        const decryptedRole = decryptData(encryptedRole);
        console.log('Rol desencriptado:', decryptedRole); // Consola para verificar el rol desencriptado
        setUserRole(decryptedRole);
    }

    const fetchUserRole = async () => {
        if (!userRole) return; // Esperar a que el rol sea desencriptado
        try {
            const response = await axios.get(`http://localhost:3000/rolusuario/${userRole}`);
            const paisesPermitidos = response.data.Paises ? response.data.Paises.split(',').map(id => id.trim()) : [];
            setUserCountries(paisesPermitidos);
            console.log("Países permitidos:", paisesPermitidos);
        } catch (error) {
            console.error("Error al obtener el rol del usuario", error);
        }
    };

    fetchUserRole();

    const fetchPaises = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/pais/`);
            setPaises(response.data);
            console.log("Lista de países:", response.data); // Verifica los países obtenidos
        } catch (error) {
            console.error("Error al obtener la lista de paises", error);
        }
    };
    fetchPaises();
}, [userRole]);

  // Verifica los países que se están filtrando
  useEffect(() => {
    console.log("Paises disponibles:", paises);
    console.log("Paises del usuario:", userCountries);
  }, [paises, userCountries]);

  const menuItems = [
       {
           title: "Matriz de Perfiles",
           icon: <GrTable />,
           subNav: [
               {
                   title: "Reportes",
                   path: "/reportes",
                   icon: <GrDocumentDownload />,
               },
           ].concat(
               paises
                   .filter(pais => userCountries.includes(pais.id.toString())) // Filtrar según los países del usuario
                   .map((pais) => ({
                       title: pais.N_Pais,
                       icon: <Banderas src={require(`../imgs/${pais.N_Pais}.png`)} alt="Flag image" />,
                       path: `/matrizPais?pais=${encodeURIComponent(encryptData(pais.id))}&Nombre=${encodeURIComponent(encryptData(pais.N_Pais))}`,
                   }))
           ),
       },
       {
           title: "Estructura",
           icon: <GrGroup />,
           subNav: [
               {
                   title: "Paises",
                   path: "/paises",
                   icon: <GrGlobe />,
               },
               {
                   title: "División",
                   path: "/division",
                   icon: <GrBusinessService />,
               },
               {
                   title: "Razón Social",
                   path: "/razonsocial",
                   icon: <GrOrganization />,
               },
               {
                   title: "Departamentos",
                   path: "/departamento",
                   icon: <GrFolder />,
               },
               {
                   title: "Aplicaciones",
                   path: "/aplicacion",
                   icon: <GrMonitor />,
               },
               {
                   title: "Ambientes",
                   path: "/ambiente",
                   icon: <GrSystem />,
               },
               {
                   title: "Centro de Costes",
                   path: "/centrocosto",
                   icon: <GrMultiple />,
               },
               {
                   title: "Puestos",
                   path: "/puesto",
                   icon: <LiaUserTieSolid />,
               },
           ],
       },
       {
           title: "Gestión de Usuarios",
           icon: <GrUserSettings />,
           subNav: [
               {
                   title: "Usuarios",
                   path: "/usuario",
                   icon: <GrContactInfo />,
               },
               {
                   title: "Roles y Permisos",
                   path: "/rolespermisos",
                   icon: <GrShieldSecurity />,
               },
               {
                   title: "Auditoría",
                   path: "/auditoria",
                   icon: <GrSearch />,
               },
           ],
       },
   ];

  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  // Función para expandir el sidebar
  const expandSidebar = () => {
    setExpandState(true);
  };

  // Función para contraer el sidebar
  const collapseSidebar = () => {
    setExpandState(false);
  };

  return (
    <div
      className={
        isExpanded
          ? "side-nav-container"
          : "side-nav-container side-nav-container-NX"
      }
      onMouseEnter={expandSidebar}
      onMouseLeave={collapseSidebar}
    >
      <div className="nav-upper">
        <div className="nav-menu">
          {menuItems
            .filter(item => userRole === '1' || item.title === "Matriz de Perfiles") // Filtrar según el rol del usuario
            .map((menuItem, index) => (
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
            <div className="nav-footer-info"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNavBar;
