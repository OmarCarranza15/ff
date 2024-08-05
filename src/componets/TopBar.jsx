import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa"; // Importamos el icono FaUser de FontAwesome
import { IoIosLogOut } from "react-icons/io";
import { AiFillQuestionCircle } from "react-icons/ai";
import "../styles/TopBar.css"; // Ajusta la ruta de los estilos según sea necesario
import logo from "../imgs/OIP.jfif";
import styled from "styled-components";
import CryptoJS from "crypto-js";
import {
  ModalOverlay,
  ModalContainer,
  ModalTitleTop,
  ModalMessage,
  ButtonContainer,
  ModalButtonB,
  CancelButton
} from "./Estilos.jsx";

const Image = styled.img`
  width: 100%;
  height: auto;
`;



const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitleTop>Cerrar sesión</ModalTitleTop>
        <ModalMessage><AiFillQuestionCircle className="questionCircle" />¿Estás seguro de que deseas cerrar sesión?</ModalMessage>
        <ButtonContainer>
          <ModalButtonB className="btn btn-outline-primary" onClick={onConfirm}>Confirmar</ModalButtonB>
          <CancelButton className="btn btn-outline-danger" onClick={onClose}>Cancelar</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};



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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      const decryptedUsername = decryptData(storedUsername); // Desencriptar nombre de usuario
      setUsername(decryptedUsername);
    }
  }, []);

  const handleLogoutClick = () => {
    setIsModalOpen(true); // Abrir el modal de confirmación
  };

  const handleConfirmLogout = () => {
    sessionStorage.removeItem('username'); // Limpiar los datos del usuario
    window.location.href = '/'; // Redirigir al login
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar el modal de confirmación
  };

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
        <IoIosLogOut 
          className="sesion-icon" 
          style={{ marginLeft: "10px" }} 
          onClick={handleLogoutClick} 
        />
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onConfirm={handleConfirmLogout} 
      />
    </div>
  );
};

export default TopBar;