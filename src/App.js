import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from "./componets/Login.jsx";
import LandingPage from "./componets/landingPage.jsx";
import Paises from "./componets/Paises.jsx";
import RazonSocial from "./componets/RazonSocial.jsx";
import Departamento from "./componets/Departamento.jsx";
import Aplicacion from "./componets/Aplicacion.jsx";
import Ambiente from "./componets/Ambiente.jsx";
import CentroCosto from "./componets/CentroCosto.jsx";
import Puesto from "./componets/Puesto.jsx";
import Division from "./componets/Division.jsx";
import Usuario from "./componets/Usuario.jsx";
import MatrizPais from "./componets/matrizPais.jsx";
import Auditoria from './componets/Auditoria.jsx';
import RolesyPermisos from './componets/RolesyPermisos.jsx';

function App() {
  return(
    <div className='fondo-difuminado'>
    <div className='relativo'>
      <div className='App'>
        <div className='App'>
          <BrowserRouter>
            <div>
              <Routes>
                <Route path='/' element={<Login/>} />
                <Route path='/landingPage' element={<LandingPage/>}/>
                <Route path='/paises' element ={<Paises/>}/>
                <Route path='/razonsocial' element = {<RazonSocial/>}/>
                <Route path='/departamento' element = {<Departamento/>}/>
                <Route path ='/aplicacion' element = {<Aplicacion/>}/>
                <Route path='/ambiente' element = {<Ambiente/>}/>
                <Route path='/centrocosto' element = {<CentroCosto/>}/>
                <Route path='/puesto' element = {<Puesto/>}/>
                <Route path='/division' element = {<Division/>}/>
                <Route path='/usuario' element = {<Usuario/>}/>
                <Route path='/matrizPais' element = {<MatrizPais/>}/>
                <Route path='/auditoria' element = {<Auditoria/>}/>
                <Route path='/rolespermisos' element = {<RolesyPermisos/>}/>
              </Routes>  
            </div>
          </BrowserRouter>
        </div>
      </div>
    </div>  
    </div>
  );
}

export default App;
