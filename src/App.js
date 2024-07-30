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
import ProtectedRoute from './componets/ProtectedRoute.jsx';
import Dashboard from './componets/Dashboard.jsx';

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
                <Route path='/landingPage' element={<ProtectedRoute><LandingPage/></ProtectedRoute>}/>
                <Route path='/paises' element ={<ProtectedRoute><Paises/></ProtectedRoute>}/>
                <Route path='/razonsocial' element = {<ProtectedRoute><RazonSocial/></ProtectedRoute>}/>
                <Route path='/departamento' element = {<ProtectedRoute><Departamento/></ProtectedRoute>}/>
                <Route path ='/aplicacion' element = {<ProtectedRoute><Aplicacion/></ProtectedRoute>}/>
                <Route path='/ambiente' element = {<ProtectedRoute><Ambiente/></ProtectedRoute>}/>
                <Route path='/centrocosto' element = {<ProtectedRoute><CentroCosto/></ProtectedRoute>}/>
                <Route path='/puesto' element = {<ProtectedRoute><Puesto/></ProtectedRoute>}/>
                <Route path='/division' element = {<ProtectedRoute><Division/></ProtectedRoute>}/>
                <Route path='/usuario' element = {<ProtectedRoute><Usuario/></ProtectedRoute>}/>
                <Route path='/matrizPais' element = {<ProtectedRoute><MatrizPais/></ProtectedRoute>}/>
                <Route path='/auditoria' element = {<ProtectedRoute><Auditoria/></ProtectedRoute>}/>
                <Route path='/rolespermisos' element = {<ProtectedRoute><RolesyPermisos/></ProtectedRoute>}/>
                <Route path='/Dashboard' element ={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
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