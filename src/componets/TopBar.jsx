import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa"; // Importamos el icono FaUser de FontAwesome
import { IoIosLogOut } from "react-icons/io";
import "../styles/TopBar.css"; // Ajusta la ruta de los estilos según sea necesario
import logo from "../imgs/OIP.jfif";
import styled from "styled-components";
import CryptoJS from "crypto-js";

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const secretKey = 'mySecretKey'; // Clave secreta para desencriptar datos

const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8).replace(/^"|"$/g, ''); // Eliminar comillas
  } catch (error) {
    console.error("Error al desencriptar datos:", error);
    return '';
  }
};

const TopBar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      const decryptedUsername = decryptData(storedUsername); // Desencriptar nombre de usuario
      //console.log("Decrypted Username:", decryptedUsername); // Verifica el valor desencriptado
      setUsername(decryptedUsername);
    }
  }, []);

  return (
    <div className="top-bar">
      <div className="nav">
        <a href="/landingPage" style={{ textDecoration: 'none' }}>
          <Image src={logo} />
        </a>
      </div>
      <div className="nav-brand">
        <a href="/landingPage" style={{ textDecoration: 'none' }}>
          <h2 className="icon">Ficohsa</h2>
        </a>
      </div>
      <div className="top-bar-right">
        <FaUser className="user-icon" />
        <p className="user-name">{username}</p>
        <a href="/" ><IoIosLogOut className="user-icon" style={{marginLeft: "10px"}}/></a> {/*Este icono nos sirve para mandarnos al login de nuevo*/}
      </div>
    </div>
  );
};

export default TopBar;
