import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from "./componets/Login.jsx";
import LandingPage from "./componets/landingPage.jsx";


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
