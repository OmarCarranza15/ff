import React, { useState,useEffect } from "react";
import {GrTable, GrSystem, GrUserSettings, GrGroup, GrGlobe, GrContactInfo, GrMonitor, GrOrganization, GrShieldSecurity, GrMultiple, GrFlag, GrFolder, GrSearch, GrArticle, GrBusinessService} from "react-icons/gr";

import "../styles/SideNavBar.css";
import axios from "axios";

const SideNavBar = () => {
    const [isExpanded, setExpandState] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [paises, setPaises]= useState([]);

    useEffect(() => {
        const fetchPaises = async () =>{
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
            icon: <GrTable/>,
            subNav: paises.map( pais=> ({
                title: pais.N_Pais,
                icon: <GrFlag/>, // Icono de bandera
                path:"/landingPage"
            }
            ))
            
        },
        {
            title: "Estructura",
            icon: <GrGroup />, // Icono de edificio
            subNav: [
                {
                    title: "Paises",
                    path: "/paises",
                    icon: <GrGlobe />, // Icono de globo
                },
                {
                    title: "División",
                    path: "/division",
                    icon: <GrBusinessService  />,
                },
                {
                    title: "Razón Social",
                    path: "/razonsocial",
                    icon: <GrOrganization />, // Icono de empresa
                },
                {
                    title: "Departamentos",
                    path: "/departamento",
                    icon: <GrFolder/>, // Icono de carpeta
                },
                {
                    title: "Aplicaciones",
                    path: "/aplicacion",
                    icon: <GrMonitor />, // Icono de aplicaciones
                },
                {
                    title: "Ambientes",
                    path: "/ambiente",
                    icon: <GrSystem />, // Icono de nube
                },
                {
                    title: "Centro de Costes",
                    path: "/centrocosto",
                    icon: <GrMultiple />, // Icono de pastel
                },
                {
                    title: "Puestos",
                    path: "/puesto",
                    icon: <GrArticle/>, // Icono de pastel
                },
            ],
        },
        {
            title: "Gestión de Usuarios",
            icon: <GrUserSettings />, // Icono de usuario
            subNav: [
                {
                    title: "Usuarios",
                    path: "/Gestion-de-Usuarios/Usuarios",
                    icon: <GrContactInfo />, // Icono de personas
                },
                {
                    title: "Roles y Permisos",
                    path: "/Gestion-de-Usuarios/Roles-y-Permisos",
                    icon: <GrShieldSecurity />, // Icono de candado
                },
            ],
        },
        {
            title: "Auditoria",
            path: "/Auditoria",
            icon: <GrSearch />, // Icono de lupa
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
