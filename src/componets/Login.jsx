
import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [userPermissions, setUserPermissions] = useState({ insert: false, edit: false });
    const [userCountries, setUserCountries] = useState([]);
    const [isNewPasswordEmpty, setIsNewPasswordEmpty] = useState(false);
    const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:3000/usuarios/?Usuario=${username}`);
            console.log('response.data:', response.data);

            const user = response.data.find(user => user.Usuario === username && user.Contrasenia === password);

            if (user) {
                setUserId(user.id);
                setUserName(user.Nombre);
                setUserRole(user.ID_RolUsuario);

                // Obtener permisos y países del rol del usuario
                const roleResponse = await axios.get(`http://localhost:3000/rolusuario/${user.ID_RolUsuario}`);
                const roleData = roleResponse.data;

                // Guardar permisos
                setUserPermissions({
                    insert: roleData.Insertar === 1,
                    edit: roleData.Editar === 1
                });

                // Guardar países
                setUserCountries(roleData.Paises.split(',').map(paisId => parseInt(paisId, 10)));

                if (user.Estado === 1) {
                    setIsNewUser(true);
                } else if (user.Estado === 3) {
                    setError('Este usuario ha expirado');
                } else {
                    // Guardar datos en sessionStorage
                    sessionStorage.setItem('userId', user.id); // Guardar ID del usuario
                    sessionStorage.setItem('username', user.Nombre);
                    sessionStorage.setItem('userRole', user.ID_RolUsuario);
                    sessionStorage.setItem('userPermissions', JSON.stringify({
                        insert: roleData.Insertar === 1,
                        edit: roleData.Editar === 1
                    }));
                    sessionStorage.setItem('userCountries', JSON.stringify(userCountries));
                    navigate('/landingPage');
                }
            } else {
                setError('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión', error);
            setError('Usuario o contraseña incorrectos');
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword === '') {
            setIsNewPasswordEmpty(true);
        } else {
            setIsNewPasswordEmpty(false);
        }

        if (confirmPassword === '') {
            setIsConfirmPasswordEmpty(true);
        } else {
            setIsConfirmPasswordEmpty(false);
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{12,}$/;

        if (!passwordRegex.test(newPassword)) {
            setError('La nueva contraseña debe tener al menos 12 caracteres, una letra mayúscula, un número y un carácter especial.');
            return;
        }

        // Validar que la nueva contraseña no sea igual a la anterior
        if (newPassword === password) {
            setError('La nueva contraseña no puede ser igual a la contraseña anterior.');
            return;
        }

        try {
            if (!userId) {
                setError('No se encontró el ID del usuario. Inicie sesión nuevamente.');
                return;
            }

            const updateResponse = await axios.put(`http://localhost:3000/usuarios/${userId}`, {
                Contrasenia: newPassword,
                Estado: 2
            });

            if (updateResponse.status === 200) {
                sessionStorage.setItem('username', userName);
                sessionStorage.setItem('userRole', userRole); // Guardar el rol del usuario
                sessionStorage.setItem('userPermissions', JSON.stringify(userPermissions));
                sessionStorage.setItem('userCountries', JSON.stringify(userCountries));
                navigate('/landingPage');
            } else {
                setError('Error al cambiar la contraseña');
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña', error);
            setError('Error al cambiar la contraseña');
        }
    };


    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="in-group">Inicio de Sesión</h2>
                <label>Ingrese su Usuario de Red y Contraseña</label>
                <br />
                <br />
                <div className="form-group">
                    <label>Usuario:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                </div>
                {isNewUser && (
                    <>
                        <p className="message">Debe cambiar su contraseña actual.</p>
                        <div className="form-group">
                            <label className="bold-label">Nueva Contraseña:</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                className={`form-control ${isNewPasswordEmpty ? 'input-error' : ''}`} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="bold-label">Confirmar Contraseña:</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                className={`form-control ${isConfirmPasswordEmpty ? 'input-error' : ''}`} 
                                required 
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handlePasswordChange}>Cambiar Contraseña</button>
                    </>
                )}
                {!isNewUser && <button type="submit" className="btn btn-primary">Iniciar Sesión</button>}
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="form-floating mb-3 mt-3">
                    <a href="/Solicitud" style={{ textDecoration: 'none' }}><span className="form-con">He olvidado mi contraseña</span></a>
                </div>
                <br />
            </form>
        </div>
    );
};

export default Login;
