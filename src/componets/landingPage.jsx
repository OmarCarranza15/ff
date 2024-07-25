import {useEffect, useState} from "react";
import React from "react";
import axios from "axios";


const LandingP = () => {
    const [username, setUsername] = useState('');
    const [paises, setPaises]= useState([]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
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
    

    return (
        <div>
            <h1>Bienvenido, {username}</h1>

            <h1>Paises</h1>
            <div>
                {paises.map((pais)=>(
                    <button key={pais.id}>{pais.N_Pais}</button>
                ))}
            </div>
        </div>
    );
}

export default LandingP;