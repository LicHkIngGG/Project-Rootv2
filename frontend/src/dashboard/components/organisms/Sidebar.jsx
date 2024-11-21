import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const [isVisible, setIsVisible] = useState(false); // Por defecto, sidebar oculto

  const handleSelect = (path) => {
    setSelected(path);
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="sidebar-container">
      {/* Botón para mostrar/ocultar */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isVisible ? '❮' : '❯'}
      </button>

      {/* Sidebar con visibilidad controlada */}
      <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
        <h2>ADMIN</h2>
        <ul>
          <li>
            <Link
              to="/"
              className={selected === '/' ? 'selected' : ''}
              onClick={() => handleSelect('/')}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/registro"
              className={selected === '/registro' ? 'selected' : ''}
              onClick={() => handleSelect('/registro')}
            >
              Registro
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className={selected === '/calendar' ? 'selected' : ''}
              onClick={() => handleSelect('/calendar')}
            >
              Calendar
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className={selected === '/reports' ? 'selected' : ''}
              onClick={() => handleSelect('/reports')}
            >
              Reports
            </Link>
          </li>
          <li>
            <Link
              to="/administracion"
              className={selected === '/administracion' ? 'selected' : ''}
              onClick={() => handleSelect('/administracion')}
            >
              Administración
            </Link>
          </li>
          <li>
            <Link
              to="/Reconocimiento"
              className={selected === '/Reconocimiento' ? 'selected' : ''}
              onClick={() => handleSelect('/Reconocimiento')}
            >
              Reconocimiento
            </Link>
          </li>
          <li>
            <Link
              to="/RegistroN"
              className={selected === '/RegistroN' ? 'selected' : ''}
              onClick={() => handleSelect('/RegistroN')}
            >
              RegistroN
            </Link>
          </li>
          <li>
            <Link
              to="/Entrenamiento"
              className={selected === '/Entrenamiento' ? 'selected' : ''}
              onClick={() => handleSelect('/Entrenamiento')}
            >
              Entrenamiento
            </Link>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {/* Aquí puedes renderizar otros componentes o contenido */}
      </div>
    </div>
  );
};

export default Sidebar;
