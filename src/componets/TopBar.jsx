import React from "react";
import {useEffect, useState} from "react";
import { FaUser } from "react-icons/fa"; // Importamos el icono FaUser de FontAwesome
import "../styles/TopBar.css"; // Ajusta la ruta de los estilos según sea necesario
import logo from "../imgs/OIP.jfif"
import styled from "styled-components";

const Image = styled.img`
width: 100%;
height: auto`
const TopBar = ({ userName }) => {
    const [username, setUsername] = useState('');


    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, [])

    

    return (
        
        <div className="top-bar">
            <div className="nav">
                <a href="/landingPage" style={{textDecoration: 'none'}}><Image src = {logo}/> </a>
            </div>
            <div className="nav-brand">
                <a href="/landingPage" style={{textDecoration: 'none'}}><h2 className="icon">Ficohsa</h2> </a>
            </div>
            <div className="top-bar-right">
                <FaUser className="user-icon" />
                <p className="user-name">{username}</p>
            </div>
        </div>
        
    );
};

export default TopBar;