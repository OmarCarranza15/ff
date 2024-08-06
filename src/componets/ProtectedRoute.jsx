import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente que verifica si el usuario está autenticado
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem('username') !== null;

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;