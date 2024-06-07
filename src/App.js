import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Nav from './components/Nav/Nav';
import Section1 from './components/Main/Section1';
import Nosotros from './components/About/Nosotros';
import Contacto from './components/Contact/Contacto';
import Hoteles from './components/Hoteles/Hoteles'; 
import Alojamiento from './components/Alojamiento/Alojamiento';
import Login from './components/Login/Login'; 
import AdminPanel from './components/Admin/AdminPanel'; 
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Section1 />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/hoteles" element={<Hoteles />} />
            <Route path="/alojamiento/:id" element={<Alojamiento />} />
            <Route path="/login" element={<Login />} /> {/* Ruta para login */}
            <Route path="/admin" element={<AdminPanel />} /> {/* Ruta para panel de administración */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
