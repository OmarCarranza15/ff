import React from "react";
import {useEffect, useState} from "react";
import { FaUser } from "react-icons/fa"; // Importamos el icono FaUser de FontAwesome
import "../styles/TopBar.css"; // Ajusta la ruta de los estilos según sea necesario


const TopBar = ({ userName }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, [])

    return (
        
        <div className="top-bar">
            <div className="nav-brand">
                <h2>Ficohsa</h2>
            </div>
            <div className="top-bar-right">
                <FaUser className="user-icon" />
                <p className="user-name">{username}</p>
            </div>
        </div>
        
    );
};

export default TopBar;