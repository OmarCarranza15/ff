import{useState} from "react";
import React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import '../styles/login.css'


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

        //Hacer una solicitud para obtener el usuario por su nombre de Usuario
            const response = await axios.get(`http://localhost:3000/usuarios/?Usuario=${username}`);


            const user = response.data.find(user => user.Usuario === username && user.Contrasenia === password);

            //verificar si se encontro un usuario y si la contraseña coincide
            if (user) {
            localStorage.setItem('username', user.Nombre);

                //Al verificar que coinciden la contraseña y el usuario, nos envia a la pagina principal
                //Redirigir a la pagina de LandingPage (pagina principal) despues de iniciar sesion exitosamente
                navigate('/landingPage');
            } else{
                setError('Usuario o contraseña incorrectos')
            }
            
    }catch (error) {
        console.error('Error al intentar iniciar sesion',error);
        setError('Usuario o contraseña incorrectos');
    }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="in-group">Inicio de Sesion</h2>
                <label>Ingrese su Usuario de Red y Contraseña</label>
                <br/>
                <br/>
                <div className="form-group">
                    <label>Usuario:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required/>
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required/>
                </div>
                <button type="submit" className="btn btn-primary">Iniciar Sesion</button>
                <br/>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div className="form-floating mb-3 mt-3">
                    <a href="/Solicitud" style={{textDecoration: 'none'}}><span className="form-con">He olvidado mi contraseña</span></a>
                </div>
                <br/>
            </form>
        </div>
    );
};

export default Login;